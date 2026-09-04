import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const serviceType = data.get('service_type')?.toString().trim() || 'Ogólne / General';
    const name = data.get('name')?.toString().trim();
    const company = data.get('company')?.toString().trim();
    const phone = data.get('phone')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const cargo = data.get('cargo')?.toString().trim();
    const route = data.get('route')?.toString().trim();
    const message = data.get('message')?.toString().trim();
    const turnstileToken = data.get('cf-turnstile-response')?.toString().trim();

    // 1. Cloudflare Turnstile Verification
    if (!turnstileToken) {
      return new Response(
        JSON.stringify({ message: 'Proszę potwierdzić zabezpieczenie anty-spam / Please complete the security challenge.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(import.meta.env.TURNSTILE_SECRET_KEY || '')}&response=${encodeURIComponent(turnstileToken)}`,
    });

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      return new Response(
        JSON.stringify({
          message: 'Weryfikacja zabezpieczenia nie powiodła się / Security challenge failed.',
          errors: verifyData['error-codes'],
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Input Validation
    if (!name || !phone) {
      return new Response(
        JSON.stringify({ message: 'Imię i numer telefonu są wymagane / Name and phone number are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ message: 'Nieprawidłowy format adresu email / Invalid email address format.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. SMTP Transporter Configuration
    const port = Number(import.meta.env.SMTP_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: import.meta.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });

    // 4. Formatted Notification
    const safeName = escapeHtml(name);
    const safeCompany = company ? escapeHtml(company) : 'Brak / None';
    const safePhone = escapeHtml(phone);
    const safeEmail = email ? escapeHtml(email) : 'Brak / None';
    const safeServiceType = escapeHtml(serviceType);
    const safeCargo = cargo ? escapeHtml(cargo) : 'Brak / None';
    const safeRoute = route ? escapeHtml(route) : 'Brak / None';
    const safeMessage = message ? escapeHtml(message).replace(/\n/g, '<br>') : 'Brak dodatkowych uwag / No message provided.';

    const timestamp = new Date().toISOString();

    const mailOptions = {
      from: `"${name} (Migeola Web)" <${import.meta.env.SMTP_USER}>`,
      to: import.meta.env.CONTACT_EMAIL,
      replyTo: email || undefined,
      subject: `[NOWE ZAPYTANIE] ${serviceType} — ${name}${company ? ` (${company})` : ''}`,
      text: `
NOWE ZAPYTANIE ZE STRONY MIGEOLA.COM
====================================
Typ usługi: ${serviceType}
Imię i nazwisko: ${name}
Firma: ${company || 'Brak'}
Telefon: ${phone}
Email: ${email || 'Brak'}
Opis ładunku / maszyny: ${cargo || 'Brak'}
Trasa: ${route || 'Brak'}
Data wysłania: ${timestamp}

Wiadomość / Uwagi:
------------------
${message || 'Brak wiadomości'}
      `.trim(),
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
          <div style="background-color: #0b0f17; padding: 24px; color: #ffffff;">
            <h2 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #f8fafc;">Nowe zapytanie B2B — Migeola.com</h2>
            <p style="margin: 0; font-size: 13px; color: #94a3b8;">Typ zlecenia: <strong style="color: #60a5fa;">${safeServiceType}</strong></p>
          </div>
          <div style="padding: 24px; color: #1e293b; font-size: 14px; line-height: 1.6;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; width: 140px; color: #64748b;">Klient / Imię:</td>
                <td style="padding: 10px 0; font-weight: 700; color: #0f172a;">${safeName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Firma:</td>
                <td style="padding: 10px 0; color: #0f172a;">${safeCompany}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Telefon:</td>
                <td style="padding: 10px 0; font-weight: 700; color: #2563eb;"><a href="tel:${encodeURIComponent(phone)}" style="color: #2563eb; text-decoration: none;">${safePhone}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Email:</td>
                <td style="padding: 10px 0; color: #0f172a;">${email ? `<a href="mailto:${encodeURIComponent(email)}" style="color: #2563eb; text-decoration: none;">${safeEmail}</a>` : safeEmail}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Ładunek / Sprzęt:</td>
                <td style="padding: 10px 0; color: #0f172a;">${safeCargo}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Trasa (Skąd/Dokąd):</td>
                <td style="padding: 10px 0; color: #0f172a;">${safeRoute}</td>
              </tr>
            </table>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-top: 16px;">
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 8px;">Wiadomość / Dodatkowe uwagi:</div>
              <div style="color: #334155; white-space: pre-wrap;">${safeMessage}</div>
            </div>

            <div style="margin-top: 24px; font-size: 11px; color: #94a3b8; text-align: right;">
              Data zgłoszenia: ${timestamp} · IP / Turnstile Verified
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: 'Email sent successfully!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in /api/contact:', error);
    return new Response(
      JSON.stringify({
        message: 'Błąd podczas wysyłania wiadomości / Failed to send email.',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
