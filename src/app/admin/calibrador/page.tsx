"use client";

import { useState } from "react";
import { GIFT_CARD_TEMPLATES, GiftCardTemplateId } from "@/lib/gift-cards";

const defaultPositions = {
  recipient: { top: 55, left: 10, width: 40, fontSize: 16, color: "#2e4d41", fontWeight: "600", lineHeight: "1.2", useTopAlignment: false },
  sender:    { top: 70, left: 10, width: 40, fontSize: 16, color: "#2e4d41", fontWeight: "600", lineHeight: "1.2", useTopAlignment: false },
  amount:    { top: 40, left: 10, width: 40, fontSize: 22, color: "#C5A880", fontWeight: "800", lineHeight: "1.2", useTopAlignment: false },
  message:   { top: 55, left: 55, width: 40, fontSize: 13, color: "#4a5568", fontWeight: "400", lineHeight: "1.4", useTopAlignment: false },
  message2:  { top: 60, left: 55, width: 40, fontSize: 13, color: "#4a5568", fontWeight: "400", lineHeight: "1.4", useTopAlignment: false },
  code:      { top: 90, left: 55, width: 40, fontSize: 11, color: "#718096", fontWeight: "400", lineHeight: "1.2", useTopAlignment: false },
};

const fieldsMeta = [
  { key: "recipient" as const, label: "Para (Destinatario)",  sampleText: "Valentina Rodríguez García",   color: "bg-blue-500"   },
  { key: "sender"    as const, label: "De (Remitente)",        sampleText: "Alejandro Fernández López",    color: "bg-purple-500" },
  { key: "amount"    as const, label: "Monto",                 sampleText: "$10,000 MXN",                 color: "bg-amber-500"  },
  { key: "message"   as const, label: "Línea 1 (Máx 28)",      sampleText: "Espero que disfrutes de este", color: "bg-pink-500" },
  { key: "message2"  as const, label: "Línea 2 (Máx 59)",      sampleText: "momento de bienestar te lo mereces con todo mi corazón💕", color: "bg-pink-700" },
  { key: "code"      as const, label: "Código de reserva",     sampleText: "TEST-ZX9AB2",                  color: "bg-gray-500"   },
];

export default function GiftCardCalibratorPage() {
  const templateIds = Object.keys(GIFT_CARD_TEMPLATES) as GiftCardTemplateId[];
  const [selectedId, setSelectedId] = useState<GiftCardTemplateId>(templateIds[0]);
  const [positions, setPositions] = useState(defaultPositions);
  const [hasMessage, setHasMessage] = useState(true);
  const [clipboard, setClipboard] = useState<{ positions: typeof defaultPositions, hasMessage: boolean } | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const template = GIFT_CARD_TEMPLATES[selectedId];

  const updateField = (field: keyof typeof positions, key: string, value: number | string | boolean) => {
    // Si es un número y es NaN, no hacemos nada o ponemos 0
    const finalValue = (typeof value === 'number' && isNaN(value)) ? 0 : value;
    setPositions(prev => ({ ...prev, [field]: { ...prev[field], [key]: finalValue } }));
  };

  const handleTemplateChange = (id: GiftCardTemplateId) => {
    setSelectedId(id);
    setSaveStatus('idle');
    setSaveMessage('');
    const t = GIFT_CARD_TEMPLATES[id];
    setHasMessage(t.hasMessageOverlay);
    setPositions({
      recipient: { top: parseFloat(t.positions.recipient.top), left: parseFloat(t.positions.recipient.left), width: parseFloat(t.positions.recipient.width || "40"), fontSize: parseFloat(t.positions.recipient.fontSize), color: t.positions.recipient.color, fontWeight: t.positions.recipient.fontWeight || "600", lineHeight: t.positions.recipient.lineHeight || "1.2", useTopAlignment: t.positions.recipient.useTopAlignment === true },
      sender:    { top: parseFloat(t.positions.sender.top),    left: parseFloat(t.positions.sender.left),    width: parseFloat(t.positions.sender.width    || "40"), fontSize: parseFloat(t.positions.sender.fontSize),    color: t.positions.sender.color,    fontWeight: t.positions.sender.fontWeight    || "600", lineHeight: t.positions.sender.lineHeight    || "1.2", useTopAlignment: t.positions.sender.useTopAlignment    === true },
      amount:    { top: parseFloat(t.positions.amount.top),    left: parseFloat(t.positions.amount.left),    width: parseFloat(t.positions.amount.width    || "40"), fontSize: parseFloat(t.positions.amount.fontSize),    color: t.positions.amount.color,    fontWeight: t.positions.amount.fontWeight    || "800", lineHeight: t.positions.amount.lineHeight    || "1.2", useTopAlignment: t.positions.amount.useTopAlignment    === true },
      message:   { top: parseFloat(t.positions.message.top),   left: parseFloat(t.positions.message.left),   width: parseFloat(t.positions.message.width   || "40"), fontSize: parseFloat(t.positions.message.fontSize),   color: t.positions.message.color,   fontWeight: t.positions.message.fontWeight   || "400", lineHeight: t.positions.message.lineHeight   || "1.4", useTopAlignment: t.positions.message.useTopAlignment   === true },
      message2:  { top: parseFloat(t.positions.message2.top),  left: parseFloat(t.positions.message2.left),  width: parseFloat(t.positions.message2.width  || "40"), fontSize: parseFloat(t.positions.message2.fontSize),  color: t.positions.message2.color,  fontWeight: t.positions.message2.fontWeight  || "400", lineHeight: t.positions.message2.lineHeight  || "1.4", useTopAlignment: t.positions.message2.useTopAlignment  === true },
      code:      { top: parseFloat(t.positions.code.top),      left: parseFloat(t.positions.code.left),      width: parseFloat(t.positions.code.width      || "80"), fontSize: parseFloat(t.positions.code.fontSize),      color: t.positions.code.color,      fontWeight: t.positions.code.fontWeight      || "400", lineHeight: t.positions.code.lineHeight      || "1.2", useTopAlignment: t.positions.code.useTopAlignment      === true },
    });
  };

  const handleSavePermanently = async () => {
    setSaveStatus('saving');
    setSaveMessage('');
    try {
      const res = await fetch('/api/admin/save-template-positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          templateId: selectedId, 
          positions,
          hasMessageOverlay: hasMessage 
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setSaveStatus('saved');
        setSaveMessage(`✅ ¡"${template.name}" guardada permanentemente para todos los clientes!`);
      } else {
        setSaveStatus('error');
        setSaveMessage(`❌ Error: ${result.error}`);
      }
    } catch {
      setSaveStatus('error');
      setSaveMessage('❌ Error al conectar con el servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-10">
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            🛠️ HERRAMIENTA DE DESARROLLO — No visible para clientes
          </span>
          <h1 className="text-3xl font-bold text-gray-800">Calibrador Visual de Tarjetas</h1>
          <p className="text-gray-500 mt-2">
            Mueve los sliders hasta que el texto quede perfecto → presiona <strong>"Guardar Permanentemente"</strong>
          </p>
        </div>

        {/* Template Selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {templateIds.map(id => (
            <button key={id} onClick={() => handleTemplateChange(id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedId === id ? 'bg-[#2e4d41] text-white shadow-md' : 'bg-white text-gray-600 border hover:border-[#2e4d41]'}`}
            >
              {GIFT_CARD_TEMPLATES[id].name}
            </button>
          ))}
        </div>

        {/* Copy/Paste Actions */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => {
              setClipboard({ positions: { ...positions }, hasMessage });
              setSaveMessage('📋 Configuración copiada al portapapeles interno');
              setSaveStatus('idle');
            }}
            className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all text-sm"
          >
            📂 Copiar Diseño Actual
          </button>
          <button 
            onClick={() => {
              if (clipboard) {
                setPositions(clipboard.positions);
                setHasMessage(clipboard.hasMessage);
                setSaveMessage('📥 Diseño pegado correctamente');
                setSaveStatus('idle');
              }
            }}
            disabled={!clipboard}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all text-sm ${
              clipboard ? 'bg-[#C5A880] text-white hover:bg-[#b89060]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            📋 Pegar en esta Tarjeta
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* PREVIEW + SAVE */}
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl shadow-lg p-4 border">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Vista Previa en Tiempo Real</p>

              {/* Botón de Habilitar/Deshabilitar Mensaje */}
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => setHasMessage(!hasMessage)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    hasMessage 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                >
                  {hasMessage ? '✅ Mensaje Habilitado' : '❌ Mensaje Deshabilitado'}
                </button>
              </div>

              <div className="relative w-full rounded-xl overflow-hidden"
                style={{ aspectRatio: template.aspectRatio, containerType: 'inline-size' as any }}>
                <img src={template.imagePath} alt={template.name}
                  className="absolute inset-0 w-full h-full object-cover" />

                {fieldsMeta.map(({ key, sampleText }) => {
                  if ((key === 'message' || key === 'message2') && !hasMessage) return null;
                  if (key === 'message2' && template?.orientation === 'horizontal') return null;
                  
                  // Forzar centrado vertical si es horizontal o si el anclaje está desactivado
                  const isVertical = template?.orientation === 'vertical';
                  const useAnchor = isVertical && positions[key].useTopAlignment;
                  
                  return (
                    <div key={key} style={{
                      position: 'absolute',
                      top: `${positions[key].top}%`,
                      left: `${positions[key].left}%`,
                      width: `${positions[key].width}%`,
                      fontSize: `${positions[key].fontSize}px`,
                      color: positions[key].color,
                      fontWeight: positions[key].fontWeight,
                      lineHeight: positions[key].lineHeight,
                      transform: useAnchor ? 'none' : 'translateY(-50%)',
                      verticalAlign: 'top',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      pointerEvents: 'none',
                    }}>
                      {(() => {
                        if (key === 'amount' && template.showCurrencySymbol === false) return sampleText.replace('$', '');
                        if (key === 'message' && template.orientation === 'horizontal') {
                           // Concatenar el sample text de message2 si existe para ver el mensaje completo "original"
                           return sampleText + (fieldsMeta.find(f => f.key === 'message2')?.sampleText || '');
                        }
                        return sampleText;
                      })()}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleSavePermanently}
                disabled={saveStatus === 'saving'}
                className={`mt-4 w-full py-4 rounded-xl font-bold text-base transition-all ${
                  saveStatus === 'saving' ? 'bg-gray-300 text-gray-500 cursor-wait' :
                  saveStatus === 'saved'  ? 'bg-green-500 text-white' :
                  'bg-[#2e4d41] text-white hover:bg-[#1e3329] shadow-lg hover:shadow-xl'
                }`}
              >
                {saveStatus === 'saving' ? '⏳ Guardando...' :
                 saveStatus === 'saved'  ? '✅ ¡Guardado!' :
                 '💾 Guardar Permanentemente'}
              </button>

              {saveMessage && (
                <p className={`mt-2 text-sm text-center font-medium ${saveStatus === 'saved' ? 'text-green-600' : 'text-red-500'}`}>
                  {saveMessage}
                </p>
              )}
              <p className="text-xs text-gray-400 text-center mt-2">
                Esto actualiza <code>gift-cards.ts</code> de forma permanente para todos los clientes.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {fieldsMeta.map(({ key, label, color }) => {
              if ((key === 'message' || key === 'message2') && !hasMessage) return null;
              if (key === 'message2' && template?.orientation === 'horizontal') return null;
              return (
                <div key={key} className="bg-white rounded-2xl shadow-sm border p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <h3 className="font-bold text-gray-700">{label}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-gray-500 font-semibold">⬆ Vertical (Top)</label>
                        <input type="number" step={0.1} value={isNaN(positions[key].top) ? '' : positions[key].top} 
                          onChange={e => updateField(key, 'top', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                          className="w-16 text-right text-xs border rounded p-1 font-bold" />
                      </div>
                      <input type="range" min={0} max={100} step={0.1} value={positions[key].top}
                        onChange={e => updateField(key, 'top', parseFloat(e.target.value))}
                        className="w-full accent-[#2e4d41]" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-gray-500 font-semibold">⬅ Horizontal (Left)</label>
                        <input type="number" step={0.1} value={isNaN(positions[key].left) ? '' : positions[key].left} 
                          onChange={e => updateField(key, 'left', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                          className="w-16 text-right text-xs border rounded p-1 font-bold" />
                      </div>
                      <input type="range" min={0} max={90} step={0.1} value={positions[key].left}
                        onChange={e => updateField(key, 'left', parseFloat(e.target.value))}
                        className="w-full accent-[#2e4d41]" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-gray-500 font-semibold">↔ Ancho</label>
                        <input type="number" step={0.1} value={isNaN(positions[key].width) ? '' : positions[key].width} 
                          onChange={e => updateField(key, 'width', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                          className="w-16 text-right text-xs border rounded p-1 font-bold" />
                      </div>
                      <input type="range" min={5} max={90} step={1} value={positions[key].width}
                        onChange={e => updateField(key, 'width', parseFloat(e.target.value))}
                        className="w-full accent-[#2e4d41]" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-gray-500 font-semibold">🔤 Tamaño (px)</label>
                        <input type="number" step={0.1} value={isNaN(positions[key].fontSize) ? '' : positions[key].fontSize} 
                          onChange={e => updateField(key, 'fontSize', e.target.value === '' ? 8 : parseFloat(e.target.value))}
                          className="w-16 text-right text-xs border rounded p-1 font-bold" />
                      </div>
                      <input type="range" min={8} max={60} step={0.5} value={positions[key].fontSize}
                        onChange={e => updateField(key, 'fontSize', parseFloat(e.target.value))}
                        className="w-full accent-[#2e4d41]" />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold">🎨 Color</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="color" value={positions[key].color}
                          onChange={e => updateField(key, 'color', e.target.value)}
                          className="w-10 h-8 rounded cursor-pointer border border-gray-200" />
                        <input type="text" value={positions[key].color}
                          onChange={e => updateField(key, 'color', e.target.value)}
                          className="flex-1 text-xs border rounded px-2 py-1 font-mono" />
                      </div>
                    </div>

                    <div>
                      {template?.orientation === 'vertical' && (
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs text-gray-500 font-semibold">💪 Grosor</label>
                          <button
                            onClick={() => updateField(key, 'useTopAlignment', !positions[key].useTopAlignment)}
                            className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${
                              positions[key].useTopAlignment
                                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {positions[key].useTopAlignment ? '⚓ Anclaje: Superior' : '⚓ Anclaje: Centro'}
                          </button>
                        </div>
                      )}
                      <select value={positions[key].fontWeight}
                        onChange={e => updateField(key, 'fontWeight', e.target.value)}
                        className="w-full mt-1 border rounded px-2 py-1.5 text-sm">
                        <option value="400">Normal</option>
                        <option value="600">Semi-bold</option>
                        <option value="700">Bold</option>
                        <option value="800">Extra-bold</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                       <div className="flex justify-between items-center mb-1">
                         <label className="text-xs text-gray-500 font-semibold">↕ Interlineado</label>
                         <input type="number" step={0.1} value={isNaN(parseFloat(positions[key].lineHeight)) ? '' : positions[key].lineHeight} 
                           onChange={e => updateField(key, 'lineHeight', e.target.value === '' ? '1.0' : e.target.value)}
                           className="w-16 text-right text-xs border rounded p-1 font-bold" />
                       </div>
                       <input type="range" min={1} max={2.5} step={0.1} value={parseFloat(positions[key].lineHeight)}
                        onChange={e => updateField(key, 'lineHeight', e.target.value)}
                        className="w-full accent-[#C5A880]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
