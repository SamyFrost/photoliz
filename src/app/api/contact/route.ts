import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { SITE } from "@/lib/site";

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid", fields: Object.keys(parsed.error.flatten().fieldErrors) }, { status: 400 });
  }
  const data = parsed.data;
  if (data.website) return NextResponse.json({ ok: true }); // bot

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return NextResponse.json({ ok: false, error: "not-configured" }, { status: 503 });
  }

  const rows: [string, string | undefined][] = [
    ["Nombre", data.name],
    ["Correo", data.email],
    ["Teléfono", data.phone],
    ["Servicio", data.service],
    ["Fecha", data.date],
    ["Idioma", data.locale === "en" ? "English" : "Español"],
  ];
  const html = `
    <div style="font-family:Arial,sans-serif;color:#1d1a25;max-width:560px">
      <h2 style="color:#23143a;letter-spacing:.12em">PHOLIZ · Nuevo mensaje</h2>
      <table style="border-collapse:collapse">${rows
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#8f672e"><b>${k}</b></td><td>${escape(v!)}</td></tr>`)
        .join("")}</table>
      <p style="white-space:pre-wrap;border-top:1px solid #dbd8dd;margin-top:16px;padding-top:16px">${escape(data.message)}</p>
    </div>`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM ?? "PHOLIZ <onboarding@resend.dev>",
    to: process.env.CONTACT_TO ?? SITE.email,
    replyTo: data.email,
    subject: `Nueva consulta: ${data.service || "sesión"} · ${data.name}`,
    html,
  });
  if (error) {
    console.error("[contact] resend error", error);
    return NextResponse.json({ ok: false, error: "send-failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
