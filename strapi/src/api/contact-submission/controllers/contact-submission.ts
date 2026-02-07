import { factories } from "@strapi/strapi";
import {
  getTextTemplate,
  getHtmlTemplate,
  getSubject,
} from "../templates/contact-email";

export default factories.createCoreController(
  "api::contact-submission.contact-submission",
  ({ strapi }) => ({
    async create(ctx) {
      const { name, email, company, message } = ctx.request.body.data || ctx.request.body;

      // Validate required fields
      if (!name || !email || !message) {
        return ctx.badRequest("Name, email, and message are required");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return ctx.badRequest("Invalid email format");
      }

      let emailSent = false;

      try {
        // Prepare email data
        const emailData = { name, email, company, message };

        // Send email notification using templates
        await strapi.plugins["email"].services.email.send({
          to: process.env.CONTACT_EMAIL || "saint6studios@gmail.com",
          subject: getSubject(name),
          text: getTextTemplate(emailData),
          html: getHtmlTemplate(emailData),
        });

        emailSent = true;
      } catch (err) {
        strapi.log.error("Failed to send contact email:", err);
      }

      // Save the submission to database
      const entry = await strapi.entityService.create(
        "api::contact-submission.contact-submission",
        {
          data: {
            name,
            email,
            company: company || null,
            message,
            emailSent,
          },
        }
      );

      return { data: { id: entry.id, emailSent }, meta: {} };
    },
  })
);
