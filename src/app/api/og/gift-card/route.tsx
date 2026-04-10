import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { GIFT_CARD_TEMPLATES, GiftCardTemplateId } from '@/lib/gift-cards';

export const runtime = 'edge';

// We need to fetch the image as ArrayBuffer to render it in OG
async function fetchImage(url: string) {
  const res = await fetch(url);
  return await res.arrayBuffer();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const templateId = searchParams.get('templateId') as GiftCardTemplateId;
    const recipient = searchParams.get('recipient') || '';
    const sender = searchParams.get('sender') || '';
    const amount = searchParams.get('amount') || '';
    const message = searchParams.get('msg1') || '';
    const message2 = searchParams.get('msg2') || '';
    const code = searchParams.get('code') || '';

    const template = GIFT_CARD_TEMPLATES[templateId];

    if (!template) {
      return new Response('Template not found', { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bonanzabienestar.com';
    const encodedPath = template.imagePath.split('/').map((part, i) => i > 0 ? encodeURIComponent(part) : part).join('/');
    const imageUrl = `${appUrl}${encodedPath.startsWith('/') ? '' : '/'}${encodedPath}`;

    const bgImage = await fetchImage(imageUrl);
    const isVertical = template.orientation === 'vertical';

    // Width and height mapping for rendering the PNG.
    // Standardizing dimensions so fonts scale relatively perfectly.
    // If the calibrator preview was ~600px wide for horizontal...
    const WIDTH = 1200;
    const HEIGHT = isVertical ? 1600 : 800; // Let's use 1200x800 for horizontal (aspect 1.5) and 1200x1600 for vertical (aspect 0.75)

    // Helper to calculate pixel position from percentage based on container size
    const getPx = (pctString: string, max: number) => {
      const val = parseFloat(pctString);
      return isNaN(val) ? 0 : (val / 100) * max;
    };

    // Helper to scale font size from calibrated size.
    // If calibrator width was ~600px, but OG canvas is 1200px, 
    // real font size needs to be 2x what is in `positions`.
    // Actually, Satori handles absolute pixels directly. If we render at 600px width:
    const renderWidth = 800;
    const renderHeight = renderWidth / template.aspectRatio;

    const amountText = template.showCurrencySymbol === false ? amount : `$${amount} MXN`;
    let msgText = message;
    let msg2Text = message2;

    if (template.orientation === 'horizontal' && msg2Text) {
      msgText += ' ' + msg2Text;
      msg2Text = '';
    }

    const renderText = (key: keyof typeof template.positions, text: string) => {
      const pos = template.positions[key];
      if (!pos || !text) return null;

      const useAnchor = isVertical && pos.useTopAlignment;
      const topPx = getPx(pos.top, renderHeight);
      const leftPx = getPx(pos.left, renderWidth);
      const widthPx = pos.width ? getPx(pos.width, renderWidth) : undefined;
      const fontSize = parseFloat(pos.fontSize) * (renderWidth / 600); // Scale up proportionally if calibrator was ~600px

      return (
        <div
          style={{
            position: 'absolute',
            top: useAnchor ? topPx : topPx,
            // Satori doesn't support translateY(-50%), so we hack it by adjusting top based on font size and line height
            marginTop: useAnchor ? 0 : -(fontSize * parseFloat(pos.lineHeight || '1.2')) / 2,
            left: leftPx,
            width: widthPx,
            fontSize: fontSize,
            color: pos.color,
            fontWeight: pos.fontWeight || 400,
            lineHeight: pos.lineHeight || 1.2,
            display: 'flex',
            alignItems: 'center',
            textAlign: 'left',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            justifyContent: 'flex-start',
            wordWrap: 'break-word',
          }}
        >
          {text}
        </div>
      );
    };

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* Background Image */}
          <img
            // @ts-ignore
            src={bgImage}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {renderText('recipient', recipient)}
          {renderText('sender', sender)}
          {renderText('amount', amountText)}
          {renderText('code', code)}
          {template.hasMessageOverlay && renderText('message', msgText)}
          {template.hasMessageOverlay && msg2Text && renderText('message2', msg2Text)}
        </div>
      ),
      {
        width: renderWidth,
        height: renderHeight,
      }
    );
  } catch (e: any) {
    console.error('OG Image Generation Error:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
