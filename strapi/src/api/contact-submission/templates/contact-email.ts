/**
 * Email templates for contact form submissions
 */

export interface ContactEmailData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

/**
 * Generate plain text email content
 */
export function getTextTemplate(data: ContactEmailData): string {
  return `
New business inquiry:

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || "Not provided"}

Message:
${data.message}
`.trim();
}

/**
 * Generate HTML email content
 */
export function getHtmlTemplate(data: ContactEmailData): string {
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const formattedMessage = escapeHtml(data.message).replace(/\n/g, "<br>");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <!-- Header -->
    <div style="background-color: #880300; padding: 24px 32px;">
      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 500;">New Business Inquiry</h1>
    </div>

    <!-- Content -->
    <div style="padding: 32px;">
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 12px 16px; border: 1px solid #e0e0e0; font-weight: 600; background-color: #fafafa; width: 120px; vertical-align: top;">Name</td>
          <td style="padding: 12px 16px; border: 1px solid #e0e0e0;">${escapeHtml(data.name)}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; border: 1px solid #e0e0e0; font-weight: 600; background-color: #fafafa; vertical-align: top;">Email</td>
          <td style="padding: 12px 16px; border: 1px solid #e0e0e0;">
            <a href="mailto:${escapeHtml(data.email)}" style="color: #880300; text-decoration: none;">${escapeHtml(data.email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; border: 1px solid #e0e0e0; font-weight: 600; background-color: #fafafa; vertical-align: top;">Company</td>
          <td style="padding: 12px 16px; border: 1px solid #e0e0e0;">${escapeHtml(data.company || "Not provided")}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; border: 1px solid #e0e0e0; font-weight: 600; background-color: #fafafa; vertical-align: top;">Message</td>
          <td style="padding: 12px 16px; border: 1px solid #e0e0e0; line-height: 1.6;">${formattedMessage}</td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="padding: 16px 32px; background-color: #fafafa; border-top: 1px solid #e0e0e0;">
      <p style="margin: 0; font-size: 12px; color: #666;">
        This email was sent from the Saint 6 Studios website contact form.
      </p>
    </div>
  </div>
</body>
</html>
`.trim();
}

/**
 * Get the email subject line
 */
export function getSubject(name: string): string {
  return `Saint 6 - New business inquiry from ${name}`;
}
