import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const name = data.get('name');
    const company = data.get('company');
    const phone = data.get('phone');
    const email = data.get('email');
    const cargo = data.get('cargo');
    const route = data.get('route');
    const message = data.get('message');
    const turnstileToken = data.get('cf-turnstile-response');

    // Turnstile verification
    if (!turnstileToken) {
      return new Response(
        JSON.stringify({
          message: 'Please complete the security challenge.',
        }),
        { status: 400 }
      );
    }

    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${import.meta.env.TURNSTILE_SECRET_KEY}&response=${turnstileToken}`,
    });

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      return new Response(
        JSON.stringify({
          message: 'Security challenge failed. Please try again.',
          errors: verifyData['error-codes'],
        }),
        { status: 400 }
      );
    }

    // Basic validation
    if (!name || !phone) {
      return new Response(
        JSON.stringify({
          message: 'Missing required fields (name and phone are mandatory).',
        }),
        { status: 400 }
      );
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: import.meta.env.SMTP_HOST,
      port: Number(import.meta.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${import.meta.env.SMTP_USER}>`, // ProtonMail often requires from to match authenticated user
      to: import.meta.env.CONTACT_EMAIL,
      replyTo: email?.toString() || undefined,
      subject: `New Contact Form Submission from ${name} (${company || 'No Company'})`,
      text: `
        Name: ${name}
        Company: ${company || 'N/A'}
        Phone: ${phone}
        Email: ${email || 'N/A'}
        Cargo: ${cargo || 'N/A'}
        Route: ${route || 'N/A'}
        
        Message:
        ${message || 'No message provided.'}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || 'N/A'}</p>
        <p><strong>Cargo:</strong> ${cargo || 'N/A'}</p>
        <p><strong>Route:</strong> ${route || 'N/A'}</p>
        <br>
        <p><strong>Message:</strong></p>
        <p>${message || 'No message provided.'}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
        message: 'Email sent successfully!',
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({
        message: 'Failed to send email. Please try again later.',
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
