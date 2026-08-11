import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rejectCrossSiteRequest } from "@/lib/security/requestGuards";

type RecaptchaResponse = {
  success?: boolean;
  score?: number;
  action?: string;
};

function escapeHtml(value: unknown) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function humanizeField(key: string) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function POST(req: NextRequest) {
  const rejected = rejectCrossSiteRequest(req);
  if (rejected) return rejected;

  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > 131072) {
    return NextResponse.json({ error: "Request is too large" }, { status: 413 });
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!secret || !resendKey || !adminEmail) {
      throw new Error("Application service is not configured");
    }

    const recaptchaToken = typeof data.recaptchaToken === "string" ? data.recaptchaToken : "";
    const applicantEmail = typeof data.email === "string" ? data.email.trim() : "";

    if (!recaptchaToken || !/^\S+@\S+\.\S+$/.test(applicantEmail)) {
      return NextResponse.json({ error: "Valid application details are required" }, { status: 400 });
    }

    const verificationResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: recaptchaToken }),
    });
    const verification = (await verificationResponse.json()) as RecaptchaResponse;

    if (!verification.success || (verification.score ?? 0) < 0.5 || (verification.action && verification.action !== "submit")) {
      return NextResponse.json({ error: "Security verification failed. Please try again." }, { status: 400 });
    }

    const rows = Object.entries(data)
      .filter(([key, value]) => key !== "recaptchaToken" && value !== "" && value !== null && value !== undefined)
      .map(([key, value]) => `<tr><th align="left" style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(humanizeField(key))}</th><td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(value)}</td></tr>`)
      .join("");

    const resend = new Resend(resendKey);
    const givenName = typeof data.given_name === "string" ? data.given_name : "";
    const surname = typeof data.surname === "string" ? data.surname : "";
    const fullName = `${givenName} ${surname}`.trim();
    const adminResult = await resend.emails.send({
      from: "IMMI WORLD <noreply@immicenter-online.com>",
      to: adminEmail,
      subject: `New private Canada eTA assistance request — ${fullName || "Applicant"}`,
      html: `<h1>New assistance request</h1><p>Security score: ${escapeHtml(verification.score)}</p><table cellspacing="0" cellpadding="0">${rows}</table>`,
    });
    if (adminResult.error) throw new Error(adminResult.error.message);

    const applicantResult = await resend.emails.send({
      from: "IMMI WORLD <noreply@immicenter-online.com>",
      to: applicantEmail,
      subject: "We received your information for private Canada eTA assistance",
      html: `
        <h1>We received your information</h1>
        <p>Thank you. We received the information you provided for IMMI WORLD's optional private review and guidance service.</p>
        <p>After checkout, our team can review the information and contact you by email about the next steps.</p>
        <p>IMMI WORLD is not affiliated with the Government of Canada, does not issue eTAs, and cannot guarantee a decision or processing time.</p>
        <p>Questions: <a href="mailto:contato@immi-center.com">contato@immi-center.com</a></p>
      `,
    });
    if (applicantResult.error) throw new Error(applicantResult.error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Canada application submission failed", error);
    return NextResponse.json({ error: "Unable to submit the information. Please try again." }, { status: 500 });
  }
}
