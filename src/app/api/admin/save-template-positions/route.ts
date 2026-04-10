import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { GiftCardTemplateId } from '@/lib/gift-cards';

export async function POST(req: Request) {
  const { templateId, positions, hasMessageOverlay, showCurrencySymbol } = await req.json();

  if (!templateId || !positions) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  // Read the current gift-cards.ts file
  const filePath = path.join(process.cwd(), 'src', 'lib', 'gift-cards.ts');
  const fs = await import('fs/promises');
  const currentContent = await fs.readFile(filePath, 'utf-8');

  // Build the new position object strings
  const formatPos = (p: any) =>
    `{ top: '${p.top}%', left: '${p.left}%', width: '${p.width}%', fontSize: '${p.fontSize}px', color: '${p.color}', fontWeight: '${p.fontWeight}', lineHeight: '${p.lineHeight}', useTopAlignment: ${p.useTopAlignment || false} }`;

  const newPositionsBlock = `{
    recipient: ${formatPos(positions.recipient)},
    sender:    ${formatPos(positions.sender)},
    amount:    ${formatPos(positions.amount)},
    message:   ${formatPos(positions.message)},
    message2:  ${formatPos(positions.message2)},
    code:      ${formatPos(positions.code)},
  }`;

  // 1. Reemplazar el bloque de posiciones
  const posRegex = new RegExp(
    `('${templateId}':\\s*\\{[^}]*?positions:\\s*)\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}`,
    's'
  );

  let updatedContent = currentContent.replace(posRegex, `$1${newPositionsBlock}`);

  // 2. Reemplazar hasMessageOverlay
  if (hasMessageOverlay !== undefined) {
    const hasMsgRegex = new RegExp(
      `('${templateId}':\\s*\\{[^}]*?hasMessageOverlay:\\s*)(true|false)`,
      's'
    );
    updatedContent = updatedContent.replace(hasMsgRegex, `$1${hasMessageOverlay}`);
  }

  // 3. Reemplazar showCurrencySymbol (si existe en el body)
  if (showCurrencySymbol !== undefined) {
    const showCurrRegex = new RegExp(
      `('${templateId}':\\s*\\{[^}]*?showCurrencySymbol:\\s*)(true|false)`,
      's'
    );
    // Si no existe, podríamos tener que añadirlo, pero por ahora asumimos que existe o lo ignoramos
    if (showCurrRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(showCurrRegex, `$1${showCurrencySymbol}`);
    }
  }

  await fs.writeFile(filePath, updatedContent, 'utf-8');

  return NextResponse.json({ success: true, message: `Template "${templateId}" actualizado y guardado.` });
}
