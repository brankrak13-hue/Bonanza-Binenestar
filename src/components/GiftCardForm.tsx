'use client';

import { useState } from 'react';
import { GIFT_CARD_TEMPLATES, GiftCardTemplateId, GiftCardTemplate } from '@/lib/gift-cards';
import Image from 'next/image';

export function GiftCardForm() {
  const [templateId, setTemplateId] = useState<GiftCardTemplateId>('vertical-1');
  const [amount, setAmount] = useState('1000');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendToRecipient, setSendToRecipient] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');

  const template = GIFT_CARD_TEMPLATES[templateId];

  const presetAmounts = ['500', '1000', '1500', '2000'];

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/gift-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          recipientName,
          senderName,
          amount,
          message,
          recipientEmail: sendToRecipient ? recipientEmail : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pago');
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 mt-8">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
        <h2 className="text-3xl font-light text-[#2e4d41] mb-6">Personaliza tu Tarjeta</h2>
        
        <form onSubmit={handleCheckout} className="space-y-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Diseño de la Tarjeta</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(GIFT_CARD_TEMPLATES).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplateId(t.id)}
                  className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 transform outline-none aspect-[1.5] ${
                    templateId === t.id 
                    ? 'border-[#C5A880] scale-105 shadow-md' 
                    : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img src={t.imagePath} alt={t.name} className="w-full h-full object-cover" />
                  {templateId === t.id && (
                    <div className="absolute inset-x-0 bottom-0 bg-[#C5A880]/90 text-white text-xs py-1 font-semibold">
                      Seleccionado
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Para (Nombre)</label>
              <input
                type="text"
                required
                maxLength={40}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-gray-200 bg-white shadow-sm focus:border-[#2e4d41] focus:ring-[#2e4d41] transition-colors"
                placeholder="Ej. Mamá"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">De (Tu Nombre)</label>
              <input
                type="text"
                required
                maxLength={40}
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-gray-200 bg-white shadow-sm focus:border-[#2e4d41] focus:ring-[#2e4d41] transition-colors"
                placeholder="Ej. Juan"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sendToRecipient}
                onChange={(e) => setSendToRecipient(e.target.checked)}
                className="w-5 h-5 text-[#2e4d41] border-gray-300 rounded focus:ring-[#2e4d41]"
              />
              <span className="text-sm font-medium text-gray-700">¿Enviar directamente al correo del destinatario?</span>
            </label>
            
            {sendToRecipient && (
              <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico de {recipientName || 'la persona'}</label>
                <input
                  type="email"
                  required={sendToRecipient}
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-gray-200 bg-white shadow-sm focus:border-[#2e4d41] focus:ring-[#2e4d41] transition-colors"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monto de Regalo (MXN)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {presetAmounts.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    amount === val 
                    ? 'bg-[#2e4d41] text-white' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-medium">$</span>
              <input
                type="number"
                min="100"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-lg border-gray-200 bg-white shadow-sm focus:border-[#2e4d41] focus:ring-[#2e4d41] transition-colors"
                placeholder="Otro monto"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje (150 caracteres máx.)</label>
            <textarea
              required
              maxLength={150}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-gray-200 bg-white shadow-sm focus:border-[#2e4d41] focus:ring-[#2e4d41] transition-colors resize-none"
              placeholder="Un mensaje especial con mucho cariño..."
            ></textarea>
            <div className="text-xs text-right text-gray-400 mt-1">{message.length}/150</div>
          </div>

          {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#C5A880] hover:bg-[#b09672] text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1"
          >
            {loading ? 'Procesando...' : `Adquirir Tarjeta por $${amount}`}
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="w-full lg:w-1/2">
        <div className="sticky top-24">
          <h2 className="text-xl font-medium text-gray-700 mb-6 text-center lg:text-left drop-shadow-sm">Vista Previa</h2>
          
          <div className="container-query-wrapper relative w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-50 flex items-center justify-center border-4 border-white/40 ring-1 ring-black/5" style={{ aspectRatio: template.aspectRatio }}>
            {/* The Background Image */}
            <img 
              src={template.imagePath} 
              alt="Vista previa tarjeta" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Dynamic Overlays mapped from positions config */}
            <div className="absolute inset-0 w-full h-full">
              <div 
                className="absolute"
                style={{ 
                  top: template.positions.recipient.top, 
                  left: template.positions.recipient.left,
                  width: template.positions.recipient.width,
                  color: template.positions.recipient.color,
                  fontSize: `calc(${template.positions.recipient.fontSize} * 2cqw)`,
                  textAlign: template.positions.recipient.align || 'left',
                  fontWeight: template.positions.recipient.fontWeight || 'normal',
                }}
              >
                Para: {recipientName || '[Nombre]'}
              </div>

              <div 
                className="absolute"
                style={{ 
                  top: template.positions.sender.top, 
                  left: template.positions.sender.left,
                  width: template.positions.sender.width,
                  color: template.positions.sender.color,
                  fontSize: `calc(${template.positions.sender.fontSize} * 2cqw)`,
                  textAlign: template.positions.sender.align || 'left',
                  fontWeight: template.positions.sender.fontWeight || 'normal',
                }}
              >
                De: {senderName || '[Tu Nombre]'}
              </div>

              <div 
                className="absolute"
                style={{ 
                  top: template.positions.amount.top, 
                  left: template.positions.amount.left,
                  width: template.positions.amount.width,
                  color: template.positions.amount.color,
                  fontSize: `calc(${template.positions.amount.fontSize} * 2cqw)`,
                  textAlign: template.positions.amount.align || 'left',
                  fontWeight: template.positions.amount.fontWeight || 'normal',
                }}
              >
                Monto: ${amount || '0'} MXN
              </div>

              {template.hasMessageOverlay && (
                <div 
                  className="absolute"
                  style={{ 
                    top: template.positions.message.top, 
                    left: template.positions.message.left,
                    width: template.positions.message.width,
                    color: template.positions.message.color,
                    fontSize: `calc(${template.positions.message.fontSize} * 2cqw)`,
                    textAlign: template.positions.message.align || 'left',
                    fontWeight: template.positions.message.fontWeight || 'normal',
                    lineHeight: 1.2
                  }}
                >
                  {message || 'Un mensaje especial con mucho cariño...'}
                </div>
              )}

              <div 
                className="absolute"
                style={{ 
                  top: template.positions.code.top, 
                  left: template.positions.code.left,
                  width: template.positions.code.width,
                  color: template.positions.code.color,
                  fontSize: `calc(${template.positions.code.fontSize} * 2cqw)`,
                  textAlign: template.positions.code.align || 'left',
                  fontWeight: template.positions.code.fontWeight || 'normal',
                }}
              >
                Código: BNZ-XXXXXX
              </div>
            </div>
            
            {/* Note about preview scaling using container queries logic if we used them, we'll just simulate with standard CSS or text shrink */}
            {/* We use standard CSS classes. The calc() above attempts to scale font size based on container width if supported, otherwise falling back slightly. For perfect scaling in Preview, we can use container shape. `cqw` requires a container context. Let's add that. */}
          </div>
          
          <p className="text-sm text-gray-500 mt-4 text-center">
            * Así es como tu tarjeta se enviará por correo electrónico. El código será generado automáticamente.
          </p>
        </div>
      </div>
      
      {/* We need to inject container query style for the cqw to work on the parent container */}
      <style jsx global>{`
        .container-query-wrapper {
          container-type: inline-size;
        }
      `}</style>
    </div>
  );
}
