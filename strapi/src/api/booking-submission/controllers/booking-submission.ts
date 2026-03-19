import { factories } from "@strapi/strapi";
import { Resend } from "resend";
import {
  getTextTemplate,
  getHtmlTemplate,
  getSubject,
} from "../templates/booking-email";

export default factories.createCoreController(
  "api::booking-submission.booking-submission",
  ({ strapi }) => ({
    async create(ctx) {
      const { roomTitle, dateFrom, dateTo, timeFrom, timeTo, name, email, phone, estimatedBudget, trafficSource, utmSource, utmMedium, utmCampaign, landingPage } =
        ctx.request.body.data || ctx.request.body;

      // Validate required fields
      if (!roomTitle || !name || !email || !phone) {
        return ctx.badRequest("Room, name, email, and phone are required");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return ctx.badRequest("Invalid email format");
      }

      let emailSent = false;

      try {
        const emailData = { roomTitle, dateFrom, dateTo, timeFrom, timeTo, name, email, phone, estimatedBudget, trafficSource, utmSource, utmMedium, utmCampaign, landingPage };
        const toEmail =
          process.env.BOOKING_EMAIL || process.env.CONTACT_EMAIL || "Saint6studios@gmail.com";
        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
          strapi.log.error("RESEND_API_KEY not configured");
          throw new Error("Email service not configured");
        }

        strapi.log.info(`Attempting to send booking email to: ${toEmail}`);

        const resend = new Resend(resendApiKey);
        const fromEmail =
          process.env.EMAIL_FROM || "Saint6 Studios <noreply@ccly.dev>";

        const { error } = await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          subject: getSubject(roomTitle, name),
          text: getTextTemplate(emailData),
          html: getHtmlTemplate(emailData),
        });

        if (error) {
          throw new Error(error.message);
        }

        emailSent = true;
        strapi.log.info(`Booking email sent successfully to: ${toEmail}`);
      } catch (err) {
        strapi.log.error("Failed to send booking email:", err);
      }

      // Save the submission to database
      const entry = await strapi.entityService.create(
        "api::booking-submission.booking-submission",
        {
          data: {
            roomTitle,
            dateFrom: dateFrom || null,
            dateTo: dateTo || null,
            timeFrom: timeFrom || null,
            timeTo: timeTo || null,
            name,
            email,
            phone,
            estimatedBudget: estimatedBudget != null ? estimatedBudget : null,
            emailSent,
            trafficSource: trafficSource || "organic",
            utmSource: utmSource || null,
            utmMedium: utmMedium || null,
            utmCampaign: utmCampaign || null,
            landingPage: landingPage || null,
          },
        }
      );

      return { data: { id: entry.id, emailSent }, meta: {} };
    },
  })
);
