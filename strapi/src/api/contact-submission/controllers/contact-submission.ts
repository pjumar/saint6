import { factories } from "@strapi/strapi";
import { Resend } from "resend";
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
        // TODO: restore env variable after testing
        // const toEmail = process.env.CONTACT_EMAIL || "saint6studios@gmail.com";
        const toEmail = "p@ccly.dev";
        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
          strapi.log.error("RESEND_API_KEY not configured");
          throw new Error("Email service not configured");
        }

        strapi.log.info(`Attempting to send contact email to: ${toEmail}`);

        const resend = new Resend(resendApiKey);

        const { data, error } = await resend.emails.send({
          from: "Saint 6 Studios <onboarding@resend.dev>", // Use verified domain in production
          to: toEmail,
          subject: getSubject(name),
          text: getTextTemplate(emailData),
          html: getHtmlTemplate(emailData),
        });

        if (error) {
          strapi.log.error("Resend error:", error);
          throw new Error(error.message);
        }

        emailSent = true;
        strapi.log.info(`Contact email sent successfully to: ${toEmail}, id: ${data?.id}`);
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
