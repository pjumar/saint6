/**
 * Email templates for contact form submissions
 */

export interface ContactEmailData {
  name: string;
  email: string;
  company?: string;
  message: string;
  trafficSource?: string;
  gclid?: string;
  gadCampaignId?: string;
  landingPage?: string;
}

/**
 * Generate plain text email content
 */
export function getTextTemplate(data: ContactEmailData): string {
  const source = data.trafficSource === "google_ads" ? `Google Ads (Campaign: ${data.gadCampaignId || "unknown"})` : data.trafficSource || "organic";
  return `
New business inquiry:

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || "Not provided"}
Source: ${source}
Landing Page: ${data.landingPage || "—"}

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

  const logoHtml = `<span style="font-family: Georgia, 'Times New Roman', serif; font-size: 48px; font-weight: 300; color: #ffffff; letter-spacing: 0.15em;">SAINT6</span>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Main Card -->
    <div style="background-color: #ffffff; border-radius: 0; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
      <!-- Header with Logo -->
      <div style="background-color: #880300; padding: 40px 32px; text-align: center;">
        <div style="margin-bottom: 24px;">
          ${logoHtml}
        </div>
        <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 400; letter-spacing: 0.05em; text-transform: uppercase;">New Business Inquiry</h1>
      </div>

      <!-- Content -->
      <div style="padding: 40px 32px;">
        <!-- Intro -->
        <p style="margin: 0 0 32px 0; color: #666666; font-size: 14px; line-height: 1.6;">
          You've received a new inquiry from the Saint 6 Studios website.
        </p>

        <!-- Details -->
        <div style="margin-bottom: 32px;">
          <div style="border-bottom: 1px solid #e8e8e8; padding: 16px 0;">
            <div style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">From</div>
            <div style="color: #231d1d; font-size: 16px; font-weight: 500;">${escapeHtml(data.name)}</div>
          </div>
          <div style="border-bottom: 1px solid #e8e8e8; padding: 16px 0;">
            <div style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">Email</div>
            <div style="font-size: 16px;">
              <a href="mailto:${escapeHtml(data.email)}" style="color: #880300; text-decoration: none;">${escapeHtml(data.email)}</a>
            </div>
          </div>
          <div style="border-bottom: 1px solid #e8e8e8; padding: 16px 0;">
            <div style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">Company</div>
            <div style="color: #231d1d; font-size: 16px;">${escapeHtml(data.company || "—")}</div>
          </div>
        </div>

        <!-- Traffic Source -->
        <div style="margin-bottom: 32px;">
          <div style="border-bottom: 1px solid #e8e8e8; padding: 16px 0;">
            <div style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">Traffic Source</div>
            <div style="color: #231d1d; font-size: 16px;">${escapeHtml(data.trafficSource === "google_ads" ? `Google Ads (Campaign: ${data.gadCampaignId || "unknown"})` : data.trafficSource || "organic")}${data.landingPage ? ` — ${escapeHtml(data.landingPage)}` : ""}</div>
          </div>
        </div>

        <!-- Message -->
        <div style="background-color: #fafafa; padding: 24px; border-left: 3px solid #880300;">
          <div style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Message</div>
          <div style="color: #231d1d; font-size: 15px; line-height: 1.7;">${formattedMessage}</div>
        </div>

        <!-- Reply Button -->
        <div style="margin-top: 32px; text-align: center;">
          <a href="mailto:${escapeHtml(data.email)}?subject=Re: Your inquiry to Saint 6 Studios" style="display: inline-block; background-color: #880300; color: #ffffff; padding: 14px 40px; text-decoration: none; font-size: 14px; font-weight: 500; letter-spacing: 0.05em;">Reply to ${escapeHtml(data.name.split(' ')[0])}</a>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding: 24px 32px; background-color: #231d1d; text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #ffffff; font-weight: 500;">Saint 6 Studios</p>
        <p style="margin: 0; font-size: 11px; color: rgba(255, 255, 255, 0.6);">
          6 Be Van Cam, Tan Kieng, District 7, HCMC
        </p>
      </div>
    </div>

    <!-- Disclaimer -->
    <div style="text-align: center; padding: 24px 0;">
      <p style="margin: 0; font-size: 11px; color: #999999;">
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
