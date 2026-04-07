import { Resend } from 'resend';
import { ReactElement } from 'react';

// Using a placeholder until the API key is provided
const resendApiKey = process.env.RESEND_API_KEY || 're_placeholder';
const resend = new Resend(resendApiKey);

// We will use the Bonanza email for sending
const BONANZA_EMAIL = 'bonanzabien.star@gmail.com';
const FROM_EMAIL = `Bonanza Bienestar <${BONANZA_EMAIL}>`;

export async function sendWelcomeEmail(toEmail: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: '¡Bienvenido a Bonanza Bienestar!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fcfcfc;">
          <h1 style="color: #2e4d41; text-align: center;">¡Bienvenido, ${name}!</h1>
          <p style="color: #4a5568; line-height: 1.6; text-align: center;">
            Nos alegra tenerte en nuestra comunidad. En Bonanza, nos dedicamos a ofrecerte momentos de paz y bienestar.
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://bonanza-bienestar.com" style="background-color: #2e4d41; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Explorar Servicios</a>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending welcome email:', error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmation(toEmail: string, orderDetails: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: 'Confirmación de tu Reserva - Bonanza Bienestar',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fcfcfc;">
          <h1 style="color: #2e4d41; text-align: center;">¡Tu reserva está confirmada!</h1>
          <p style="color: #4a5568; line-height: 1.6; text-align: center;">
            Gracias por confiar en Bonanza. Aquí tienes los detalles de tu compra:
          </p>
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 20px;">
            <p><strong>ID de Pedido:</strong> ${orderDetails.id || 'N/A'}</p>
            <p><strong>Fecha de Compra:</strong> ${new Date(orderDetails.orderDate).toLocaleString('es-MX')}</p>
            <p><strong>Estado:</strong> Pagado / Procesando Reservación</p>
          </div>
          <p style="color: #718096; font-size: 12px; text-align: center; margin-top: 30px; font-style: italic;">
            Si tienes alguna duda, responde a este correo.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending confirmation email:', error);
    return { success: false, error };
  }
}
