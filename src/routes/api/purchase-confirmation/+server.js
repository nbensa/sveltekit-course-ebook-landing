import { json } from "@sveltejs/kit";
import sgMail from "@sendgrid/mail";
import { SENDGRID_API_KEY } from "$env/static/private";

sgMail.setApiKey(SENDGRID_API_KEY);

const PDF_GUID_URL =
  "https://narrify-public.s3.eu-central-1.amazonaws.com/sample.pdf";

export async function POST({ request }) {
  const requestBody = await request.json();

  const response = await fetch(PDF_GUID_URL);
  const pdfBuffer = await response.arrayBuffer();
  const base64pdf = Buffer.from(pdfBuffer).toString("base64");

  console.log(base64pdf);

  const customerEmail = requestBody.data.object.customer_details.email;
  const customerName = requestBody.data.object.customer_details.name;

  const message = {
    to: customerEmail,
    from: "nbensa@gmail.com",
    subject: "Your Purchase Confirmation - Complete Spain Relocation Guide",
    html: `
    <h1>Thank You for Your Purchase!</h1>
    <p>Dear ${customerName},</p>
    <p>We appreciate your purchase of the <strong>Complete Spain Relocation Guide</strong>. We're confident that this ebook will provide you with</p>
    `,
    attachments: [
      {
        content: base64pdf,
        filename: "Digital Ebook - Spain relocation.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  await sgMail.send(message);

  return json({ response: "Email sent" });
}
