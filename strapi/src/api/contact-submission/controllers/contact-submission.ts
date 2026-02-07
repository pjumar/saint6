import { factories } from "@strapi/strapi";

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
        // Send email notification
        await strapi.plugins["email"].services.email.send({
          to: process.env.CONTACT_EMAIL || "saint6studios@gmail.com",
          subject: `Saint 6 - New business inquiry from ${name}`,
          text: `
New business inquiry:

Name: ${name}
Email: ${email}
Company: ${company || "Not provided"}

Message:
${message}
          `.trim(),
          html: `
<h2>New Business Inquiry</h2>
<table style="border-collapse: collapse; width: 100%; max-width: 600px;">
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
    <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
    <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Company</td>
    <td style="padding: 10px; border: 1px solid #ddd;">${company || "Not provided"}</td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message</td>
    <td style="padding: 10px; border: 1px solid #ddd;">${message.replace(/\n/g, "<br>")}</td>
  </tr>
</table>
          `.trim(),
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
