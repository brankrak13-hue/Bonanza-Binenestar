import { Resend } from 'resend';
import { GIFT_CARD_TEMPLATES, GiftCardTemplateId } from './gift-cards';

const resendApiKey = process.env.RESEND_API_KEY || 're_placeholder';
const resend = new Resend(resendApiKey);

const FROM_EMAIL = 'Bonanza Bienestar <hola@bonanzabienestar.com>';
const REPLY_TO_EMAIL = 'bonanzabien.star@gmail.com';

export async function sendWelcomeEmail(toEmail: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      replyTo: REPLY_TO_EMAIL,
      subject: 'Bienvenido a Bonanza Bienestar',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fcfcfc;">
          <h1 style="color: #2e4d41; text-align: center;">Bienvenido, ${name}</h1>
          <p style="color: #4a5568; line-height: 1.6; text-align: center;">
            Nos alegra tenerte en nuestra comunidad.
          </p>
        </div>
      `,
    });
    return { success: !error, data, error };
  } catch (error) {
    return { success: false, error };
  }
}

export async function sendOrderConfirmation(toEmail: string, orderDetails: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      replyTo: REPLY_TO_EMAIL,
      subject: 'Confirmacion de tu Reserva - Bonanza Bienestar',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2e4d41;">Tu reserva esta confirmada</h1>
          <p>Gracias por confiar en Bonanza.</p>
        </div>
      `,
    });
    return { success: !error, data, error };
  } catch (error) {
    return { success: false, error };
  }
}

export async function sendGiftCardEmail(toEmail: string, data: {
  templateId: GiftCardTemplateId;
  recipientName: string;
  senderName: string;
  amount: string;
  message: string;
  message2?: string;
  reservationCode: string;
}) {
  try {
    const template = GIFT_CARD_TEMPLATES[data.templateId];
    if (!template) throw new Error('Invalid template ID');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bonanzabienestar.com';
    
    // Generar la URL dinámica a la ruta OG que creamos para renderizar la tarjeta en una sola imagen (PNG flattening)
    const ogParams = new URLSearchParams({
      templateId: data.templateId,
      recipient: data.recipientName,
      sender: data.senderName,
      amount: data.amount,
      msg1: data.message || '',
      msg2: data.message2 || '',
      code: data.reservationCode,
    });
    
    const ogImageUrl = `${appUrl}/api/og/gift-card?${ogParams.toString()}`;

    // Descargar la imagen para enviarla como adjunto (CID) y evitar bloqueos en clientes de correo
    let imageBuffer: Buffer | null = null;
    try {
      const response = await fetch(ogImageUrl);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
      }
    } catch (err) {
      console.error('Error al descargar la imagen OG para el correo:', err);
    }

    const imgSrc = imageBuffer ? 'cid:giftcard' : ogImageUrl;


    const messageHtml = data.message ? `
      <div style="background-color: #FDF8F3; border-radius: 12px; padding: 20px; text-align: center; border: 1px dashed #C5A880; margin-bottom: 20px;">
        <p style="color: #2e4d41; font-size: 16px; font-style: italic; margin: 0; line-height: 1.6;">
          "${data.message}"${data.message2 ? '<br/>' + data.message2 : ''}
        </p>
      </div>` : '';

    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FDF8F3; padding: 40px 20px; color: #1a202c;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 30px; overflow: hidden; box-shadow: 0 15px 35px rgba(46, 77, 65, 0.08); border: 1px solid #efeae4;">
          
          <div style="padding: 45px 30px 30px 30px; text-align: center;">
            <div style="margin-bottom: 20px; font-size: 40px;">&#127807;</div>
            <h1 style="color: #2e4d41; margin: 0 0 10px 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.2;">
              ¡Hola, ${data.recipientName}!
            </h1>
            <p style="color: #6a7872; margin: 0; font-size: 17px; line-height: 1.5;">
              <strong>${data.senderName}</strong> te envió una tarjeta de regalo de <strong>$${data.amount} MXN</strong>.
            </p>
          </div>

          <!-- Imagen de la tarjeta generada dinamicamente en backend -->
          <div style="margin: 0 25px 25px 25px; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.1);">
            <img src="${imgSrc}" alt="Tu Tarjeta de Regalo Bonanza" style="width: 100%; height: auto; display: block;" />
          </div>

          <!-- Datos de la tarjeta en tabla limpia -->
          <div style="margin: 0 25px 30px 25px; background-color: #f8faf9; border-radius: 16px; overflow: hidden; border: 1px solid #e2ede8;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr style="border-bottom: 1px solid #e2ede8;">
                <td style="padding: 14px 20px; color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; width: 50%;">Para</td>
                <td style="padding: 14px 20px; color: #2e4d41; font-size: 15px; font-weight: 700; text-align: right;">${data.recipientName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2ede8;">
                <td style="padding: 14px 20px; color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">De</td>
                <td style="padding: 14px 20px; color: #2e4d41; font-size: 15px; font-weight: 700; text-align: right;">${data.senderName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2ede8;">
                <td style="padding: 14px 20px; color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Monto Canjeable</td>
                <td style="padding: 14px 20px; color: #2e4d41; font-size: 16px; font-weight: 800; text-align: right;">$${data.amount} MXN</td>
              </tr>
              <tr>
                <td style="padding: 14px 20px; color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Código de Regalo</td>
                <td style="padding: 14px 20px; color: #C5A880; font-size: 15px; font-weight: 800; text-align: right; font-family: monospace; letter-spacing: 1.5px;">${data.reservationCode}</td>
              </tr>
            </table>
          </div>
          
          <div style="padding: 0 30px 40px 30px; text-align: center;">
            ${messageHtml}

            <p style="color: #718096; font-size: 14px; margin-bottom: 25px; line-height: 1.6;">
              Hoy es el día perfecto para desconectar del ruido y reconectar con tu bienestar.
            </p>
            
            <a href="https://www.bonanzabienestar.com/reservar" style="background-color: #2e4d41; color: #ffffff; padding: 20px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 10px 20px rgba(46, 77, 65, 0.15); letter-spacing: 0.5px;">
              RESERVAR MI MOMENTO &#127807;
            </a>
          </div>

          <div style="background-color: #FDF8F3; padding: 25px; text-align: center; border-top: 1px solid #efeae4;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">Con amor, el equipo de Bonanza Bienestar.</p>
          </div>
          
        </div>
      </div>
    `;

    const emailOptions: any = {
      from: FROM_EMAIL,
      to: [toEmail],
      replyTo: REPLY_TO_EMAIL,
      subject: data.senderName + ' te envió una tarjeta de regalo canjeable por $' + data.amount + '!',
      html,
    };

    if (imageBuffer) {
      emailOptions.attachments = [
        {
          filename: 'tarjeta-de-regalo-bonanza.png',
          content: imageBuffer,
          content_id: 'giftcard',
        }
      ];
    }

    const { data: resData, error } = await resend.emails.send(emailOptions);

    if (error) {
      console.error('Error de Resend al enviar tarjeta de regalo:', error);
    } else {
      console.log('Correo de tarjeta de regalo enviado con éxito:', resData);
    }

    return { success: !error, data: resData, error };
  } catch (error) {
    console.error('Excepción al enviar tarjeta de regalo:', error);
    return { success: false, error };
  }
}
