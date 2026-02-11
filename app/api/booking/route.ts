import { NextResponse } from "next/server";

interface BookingRequestBody {
  roomTitle: string;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  name: string;
  email: string;
  phone: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildHtmlEmail(data: BookingRequestBody): string {
  const logoSvg = `<svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="32" font-family="Georgia, serif" font-size="32" font-weight="300" fill="#ffffff" letter-spacing="0.1em">SAINT6</text>
  </svg>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
      <div style="background-color: #880300; padding: 40px 32px; text-align: center;">
        <div style="margin-bottom: 24px;">${logoSvg}</div>
        <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 400; letter-spacing: 0.05em; text-transform: uppercase;">New Studio Booking Request</h1>
      </div>
      <div style="padding: 40px 32px;">
        <p style="margin: 0 0 32px 0; color: #666666; font-size: 14px; line-height: 1.6;">
          A new booking request has been submitted from the Saint 6 Studios website.
        </p>
        <div style="margin-bottom: 32px;">
          <div style="border-bottom: 1px solid #e8e8e8; padding: 16px 0;">
            <div style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">Studio</div>
            <div style="color: #231d1d; font-size: 16px; font-weight: 500;">${escapeHtml(data.roomTitle)}</div>
          </div>
          <div style="border-bottom: 1px solid #e8e8e8; padding: 16px 0;">
            <div style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">Date</div>
            <div style="color: #231d1d; font-size: 16px;">${escapeHtml(data.dateFrom || "—")} — ${escapeHtml(data.dateTo || "—")}</div>
          </div>
          <div style="border-bottom: 1px solid #e8e8e8; padding: 16px 0;">
            <div style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">Time</div>
            <div style="color: #231d1d; font-size: 16px;">${escapeHtml(data.timeFrom || "—")} — ${escapeHtml(data.timeTo || "—")}</div>
          </div>
          <div style="border-bottom: 1px solid #e8e8e8; padding: 16px 0;">
            <div style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">Name</div>
            <div style="color: #231d1d; font-size: 16px; font-weight: 500;">${escapeHtml(data.name)}</div>
          </div>
          <div style="border-bottom: 1px solid #e8e8e8; padding: 16px 0;">
            <div style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">Email</div>
            <div style="font-size: 16px;">
              <a href="mailto:${escapeHtml(data.email)}" style="color: #880300; text-decoration: none;">${escapeHtml(data.email)}</a>
            </div>
          </div>
          <div style="padding: 16px 0;">
            <div style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">Phone</div>
            <div style="color: #231d1d; font-size: 16px;">${escapeHtml(data.phone)}</div>
          </div>
        </div>
        <div style="margin-top: 32px; text-align: center;">
          <a href="mailto:${escapeHtml(data.email)}?subject=Re: Your booking request at Saint 6 Studios — ${escapeHtml(data.roomTitle)}" style="display: inline-block; background-color: #880300; color: #ffffff; padding: 14px 40px; text-decoration: none; font-size: 14px; font-weight: 500; letter-spacing: 0.05em;">Reply to ${escapeHtml(data.name.split(" ")[0])}</a>
        </div>
      </div>
      <div style="padding: 24px 32px; background-color: #231d1d; text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #ffffff; font-weight: 500;">Saint 6 Studios</p>
        <p style="margin: 0; font-size: 11px; color: rgba(255, 255, 255, 0.6);">6 Be Van Cam, Tan Kieng, District 7, HCMC</p>
      </div>
    </div>
    <div style="text-align: center; padding: 24px 0;">
      <p style="margin: 0; font-size: 11px; color: #999999;">This email was sent from the Saint 6 Studios booking form.</p>
    </div>
  </div>
</body>
</html>`;
}

function buildTextEmail(data: BookingRequestBody): string {
  return `New Studio Booking Request

Studio: ${data.roomTitle}
Date: ${data.dateFrom || "—"} — ${data.dateTo || "—"}
Time: ${data.timeFrom || "—"} — ${data.timeTo || "—"}

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}`;
}

export async function POST(request: Request) {
  try {
    const body: BookingRequestBody = await request.json();

    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const toEmail = process.env.BOOKING_EMAIL || process.env.CONTACT_EMAIL || "Saint6studios@gmail.com";
    const fromEmail = process.env.EMAIL_FROM || "Saint6 Studios <noreply@ccly.dev>";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        subject: `Saint 6 — Booking request: ${body.roomTitle} from ${body.name}`,
        text: buildTextEmail(body),
        html: buildHtmlEmail(body),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
