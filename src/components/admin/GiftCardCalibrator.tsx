"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { GIFT_CARD_TEMPLATES, GiftCardTemplate, GiftCardTemplateId } from "@/lib/gift-cards";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Gift, Copy, ClipboardPaste, Save, Check, X, MessageSquare, Maximize2, Minimize2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type FieldKey = "recipient" | "sender" | "amount" | "message" | "message2" | "code";

interface FieldPos {
  top: number; left: number; width: number; fontSize: number;
  color: string; fontWeight: string; lineHeight: string; useTopAlignment: boolean;
}
type Positions = Record<FieldKey, FieldPos>;

function extractFromTemplate(t: GiftCardTemplate): Positions {
  const p = (v: string | undefined, fb: number) => parseFloat(v ?? "") || fb;
  return {
    recipient: { top: p(t.positions.recipient.top, 55), left: p(t.positions.recipient.left, 10), width: p(t.positions.recipient.width, 40), fontSize: p(t.positions.recipient.fontSize, 16), color: t.positions.recipient.color, fontWeight: t.positions.recipient.fontWeight ?? "600", lineHeight: t.positions.recipient.lineHeight ?? "1.2", useTopAlignment: t.positions.recipient.useTopAlignment === true },
    sender:    { top: p(t.positions.sender.top, 70),    left: p(t.positions.sender.left, 10),    width: p(t.positions.sender.width, 40),    fontSize: p(t.positions.sender.fontSize, 16),    color: t.positions.sender.color,    fontWeight: t.positions.sender.fontWeight    ?? "600", lineHeight: t.positions.sender.lineHeight    ?? "1.2", useTopAlignment: t.positions.sender.useTopAlignment    === true },
    amount:    { top: p(t.positions.amount.top, 40),    left: p(t.positions.amount.left, 10),    width: p(t.positions.amount.width, 40),    fontSize: p(t.positions.amount.fontSize, 22),    color: t.positions.amount.color,    fontWeight: t.positions.amount.fontWeight    ?? "800", lineHeight: t.positions.amount.lineHeight    ?? "1.2", useTopAlignment: t.positions.amount.useTopAlignment    === true },
    message:   { top: p(t.positions.message.top, 55),   left: p(t.positions.message.left, 55),   width: p(t.positions.message.width, 40),   fontSize: p(t.positions.message.fontSize, 13),   color: t.positions.message.color,   fontWeight: t.positions.message.fontWeight   ?? "400", lineHeight: t.positions.message.lineHeight   ?? "1.4", useTopAlignment: t.positions.message.useTopAlignment   === true },
    message2:  { top: p(t.positions.message2.top, 60),  left: p(t.positions.message2.left, 55),  width: p(t.positions.message2.width, 40),  fontSize: p(t.positions.message2.fontSize, 13),  color: t.positions.message2.color,  fontWeight: t.positions.message2.fontWeight  ?? "400", lineHeight: t.positions.message2.lineHeight  ?? "1.4", useTopAlignment: t.positions.message2.useTopAlignment  === true },
    code:      { top: p(t.positions.code.top, 90),      left: p(t.positions.code.left, 55),      width: p(t.positions.code.width, 40),      fontSize: p(t.positions.code.fontSize, 11),      color: t.positions.code.color,      fontWeight: t.positions.code.fontWeight      ?? "400", lineHeight: t.positions.code.lineHeight      ?? "1.2", useTopAlignment: t.positions.code.useTopAlignment      === true },
  };
}

const fieldsMeta: { key: FieldKey; label: string; sample: string; dot: string }[] = [
  { key: "recipient", label: "Para (Destinatario)",  sample: "Valentina Rodríguez García",    dot: "bg-blue-500"   },
  { key: "sender",    label: "De (Remitente)",        sample: "Alejandro Fernández López",    dot: "bg-purple-500" },
  { key: "amount",    label: "Monto",                 sample: "$10,000 MXN",                  dot: "bg-amber-500"  },
  { key: "message",   label: "Línea 1 del Mensaje",   sample: "Espero que disfrutes de este", dot: "bg-pink-500"   },
  { key: "message2",  label: "Línea 2 del Mensaje",   sample: "momento de bienestar 💕",       dot: "bg-pink-700"   },
  { key: "code",      label: "Código de Reserva",     sample: "BNZA-XZ9AB2",                  dot: "bg-gray-500"   },
];

// ─── Slider Row ───────────────────────────────────────────────────────────────
function SliderRow({ label, icon, value, min, max, step, onChange }: {
  label: string; icon: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs text-gray-500 font-semibold">{icon} {label}</label>
        <input type="number" step={step} value={isNaN(value) ? "" : value}
          onChange={e => onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
          className="w-16 text-right text-xs border border-gray-200 rounded-lg p-1 font-bold focus:outline-none focus:border-emerald-400"
        />
      </div>
      <input type="range" min={min} max={max} step={step} value={isNaN(value) ? 0 : value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-[#2e4d41]"
      />
    </div>
  );
}

// ─── Preview Card ─────────────────────────────────────────────────────────────
function PreviewCard({
  template, positions, visibleFields, activeField, setActiveField, containerRef
}: {
  template: GiftCardTemplate;
  positions: Positions;
  visibleFields: typeof fieldsMeta;
  activeField: FieldKey;
  setActiveField: (k: FieldKey) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [w, setW] = useState(500);
  useEffect(() => {
    const update = () => { if (containerRef.current) setW(containerRef.current.offsetWidth); };
    update();
    const obs = new ResizeObserver(update);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [containerRef]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
      style={{ aspectRatio: template.aspectRatio }}
    >
      <img src={template.imagePath} alt={template.name} className="absolute inset-0 w-full h-full object-cover" />
      {visibleFields.map(({ key, sample }) => {
        const pos = positions[key];
        const useAnchor = template.orientation === "vertical" && pos.useTopAlignment;
        const scaledFs = w > 0 ? (pos.fontSize / 600) * w : pos.fontSize;
        return (
          <div
            key={key}
            onClick={() => setActiveField(key)}
            style={{
              position: "absolute",
              top: `${pos.top}%`, left: `${pos.left}%`, width: `${pos.width}%`,
              fontSize: `${scaledFs.toFixed(1)}px`,
              color: pos.color, fontWeight: pos.fontWeight, lineHeight: pos.lineHeight,
              transform: useAnchor ? "none" : "translateY(-50%)",
              wordWrap: "break-word", overflowWrap: "break-word", cursor: "pointer",
              outline: activeField === key ? "2px dashed rgba(197,168,128,0.9)" : "none",
              outlineOffset: "2px", borderRadius: "3px",
            }}
          >
            {key === "message" && template.orientation === "horizontal"
              ? sample + " " + fieldsMeta.find(f => f.key === "message2")?.sample
              : key === "amount" && template.showCurrencySymbol === false
              ? sample.replace("$", "")
              : sample}
          </div>
        );
      })}
    </div>
  );
}

// ─── Field Controls ───────────────────────────────────────────────────────────
function FieldControls({
  template, positions, activeField, visibleFields, setActiveField, updateField, compact = false
}: {
  template: GiftCardTemplate;
  positions: Positions;
  activeField: FieldKey;
  visibleFields: typeof fieldsMeta;
  setActiveField: (k: FieldKey) => void;
  updateField: (field: FieldKey, key: string, value: number | string | boolean) => void;
  compact?: boolean;
}) {
  const pos = positions[activeField];
  return (
    <div className="space-y-4">
      {/* Field tabs */}
      <div className="flex flex-wrap gap-1.5">
        {visibleFields.map(({ key, label, dot }) => (
          <button key={key} onClick={() => setActiveField(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              activeField === key
                ? "bg-primary text-white border-primary shadow-md"
                : "bg-white text-gray-500 border-gray-200 hover:border-primary/30"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
            {label}
          </button>
        ))}
      </div>

      {/* Controls */}
      {visibleFields.filter(f => f.key === activeField).map(({ dot, label }) => (
        <div key={activeField} className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-5">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
            <span className="font-bold text-gray-700 text-xs">{label}</span>
            <span className="ml-auto text-[10px] text-gray-400 font-mono">
              top:{pos.top.toFixed(1)}% left:{pos.left.toFixed(1)}%
            </span>
          </div>
          <div className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
            <SliderRow label="Vertical (Top %)"    icon="⬆" value={pos.top}                         min={0} max={100} step={0.1} onChange={v => updateField(activeField, "top", v)} />
            <SliderRow label="Horizontal (Left %)" icon="⬅" value={pos.left}                        min={0} max={90}  step={0.1} onChange={v => updateField(activeField, "left", v)} />
            <SliderRow label="Ancho (%)"           icon="↔" value={pos.width}                       min={5} max={90}  step={1}   onChange={v => updateField(activeField, "width", v)} />
            <SliderRow label="Tamaño (px)"         icon="🔤" value={pos.fontSize}                   min={6} max={80}  step={0.5} onChange={v => updateField(activeField, "fontSize", v)} />
            <SliderRow label="Interlineado"        icon="↕" value={parseFloat(pos.lineHeight)}      min={1} max={3}   step={0.1} onChange={v => updateField(activeField, "lineHeight", v.toFixed(1))} />
            <div>
              <label className="text-xs text-gray-500 font-semibold mb-2 block">🎨 Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={pos.color} onChange={e => updateField(activeField, "color", e.target.value)} className="w-10 h-9 rounded-lg cursor-pointer border border-gray-200" />
                <input type="text" value={pos.color} onChange={e => updateField(activeField, "color", e.target.value)} className="flex-1 text-xs border border-gray-200 rounded-xl px-2 py-2 font-mono focus:outline-none focus:border-primary/40" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold mb-2 block">💪 Grosor</label>
              <select value={pos.fontWeight} onChange={e => updateField(activeField, "fontWeight", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary/40">
                <option value="400">Normal</option>
                <option value="600">Semi-bold</option>
                <option value="700">Bold</option>
                <option value="800">Extra-bold</option>
              </select>
            </div>
            {template?.orientation === "vertical" && (
              <div className={compact ? "" : "sm:col-span-2"}>
                <label className="text-xs text-gray-500 font-semibold mb-2 block">⚓ Anclaje</label>
                <button onClick={() => updateField(activeField, "useTopAlignment", !pos.useTopAlignment)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    pos.useTopAlignment ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  {pos.useTopAlignment ? "⚓ Anclaje: Superior (top)" : "⚓ Anclaje: Centro"}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GiftCardCalibrator() {
  const templateIds = Object.keys(GIFT_CARD_TEMPLATES) as GiftCardTemplateId[];
  const firstTpl = GIFT_CARD_TEMPLATES[templateIds[0]];

  const [selectedId, setSelectedId] = useState<GiftCardTemplateId>(templateIds[0]);
  const [positions, setPositions] = useState<Positions>(() => extractFromTemplate(firstTpl));
  const [hasMessage, setHasMessage] = useState(() => firstTpl.hasMessageOverlay);
  const [clipboard, setClipboard] = useState<{ positions: Positions; hasMessage: boolean } | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [activeField, setActiveField] = useState<FieldKey>("recipient");
  const [expanded, setExpanded] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const expandedPreviewRef = useRef<HTMLDivElement>(null);

  const template = GIFT_CARD_TEMPLATES[selectedId];

  const updateField = useCallback((field: FieldKey, key: string, value: number | string | boolean) => {
    const final = typeof value === "number" && isNaN(value) ? 0 : value;
    setPositions(prev => ({ ...prev, [field]: { ...prev[field], [key]: final } }));
  }, []);

  const handleTemplateChange = (id: GiftCardTemplateId) => {
    setSelectedId(id);
    setSaveStatus("idle");
    setSaveMessage("");
    const t = GIFT_CARD_TEMPLATES[id];
    setHasMessage(t.hasMessageOverlay);
    setPositions(extractFromTemplate(t));
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    setSaveMessage("");
    try {
      const res = await fetch("/api/admin/save-template-positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: selectedId, positions, hasMessageOverlay: hasMessage }),
      });
      const result = await res.json();
      if (res.ok) {
        setSaveStatus("saved");
        setSaveMessage(`Posiciones de "${template.name}" guardadas correctamente.`);
        setTimeout(() => { setSaveStatus("idle"); setSaveMessage(""); }, 5000);
      } else {
        setSaveStatus("error");
        setSaveMessage(`Error: ${result.error}`);
      }
    } catch {
      setSaveStatus("error");
      setSaveMessage("Error al conectar con el servidor.");
    }
  };

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const visibleFields = fieldsMeta.filter(f => {
    if ((f.key === "message" || f.key === "message2") && !hasMessage) return false;
    if (f.key === "message2" && template?.orientation === "horizontal") return false;
    return true;
  });

  const SaveButton = ({ wide = false }: { wide?: boolean }) => (
    <div className={wide ? "w-full" : ""}>
      <button onClick={handleSave} disabled={saveStatus === "saving"}
        className={`${wide ? "w-full" : ""} py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
          saveStatus === "saving" ? "bg-gray-200 text-gray-400 cursor-wait" :
          saveStatus === "saved"  ? "bg-green-500 text-white" :
          saveStatus === "error"  ? "bg-red-500 text-white" :
          "bg-[#2e4d41] text-white hover:bg-[#1e3329] shadow-[#2e4d41]/20"
        }`}
      >
        {saveStatus === "saving" ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> :
         saveStatus === "saved"  ? <><Check className="w-4 h-4" /> ¡Guardado!</> :
         saveStatus === "error"  ? <><X className="w-4 h-4" /> Error</> :
         <><Save className="w-4 h-4" /> Guardar — {template.name}</>}
      </button>
      {saveMessage && (
        <p className={`text-xs text-center font-medium mt-1.5 ${saveStatus === "saved" ? "text-green-600" : saveStatus === "error" ? "text-red-500" : "text-gray-500"}`}>
          {saveMessage}
        </p>
      )}
    </div>
  );

  return (
    <>
      {/* ── EMBEDDED CARD ─────────────────────────────────────────────────────── */}
      <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-primary/5 pb-8">
            <div className="flex items-center gap-3">
              <Gift className="w-6 h-6 text-primary" />
              <CardTitle>Calibrador de Tarjetas de Regalo</CardTitle>
            </div>
            <CardDescription>
              Ajusta la posición de cada texto y guarda para que aplique a todos los clientes.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">

            {/* Template selector */}
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">Seleccionar Diseño</p>
              <div className="flex flex-wrap gap-2">
                {templateIds.map(id => (
                  <button key={id} onClick={() => handleTemplateChange(id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      selectedId === id ? "bg-primary text-white border-primary shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-primary/40"
                    }`}
                  >
                    {GIFT_CARD_TEMPLATES[id].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => { setClipboard({ positions: { ...positions }, hasMessage }); setSaveMessage("Configuración copiada."); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-all border border-gray-200">
                <Copy className="w-3.5 h-3.5" /> Copiar
              </button>
              <button onClick={() => { if (clipboard) { setPositions(clipboard.positions); setHasMessage(clipboard.hasMessage); setSaveMessage("Diseño pegado."); } }}
                disabled={!clipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${clipboard ? "bg-[#C5A880]/10 text-[#C5A880] border-[#C5A880]/30 hover:bg-[#C5A880]/20" : "bg-gray-50 text-gray-300 border-transparent cursor-not-allowed"}`}>
                <ClipboardPaste className="w-3.5 h-3.5" /> Pegar
              </button>
              <button onClick={() => setHasMessage(!hasMessage)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${hasMessage ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                <MessageSquare className="w-3.5 h-3.5" />
                {hasMessage ? "Mensaje ON" : "Mensaje OFF"}
              </button>
            </div>

            {/* Preview */}
            <div className="space-y-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold text-center">Vista Previa</p>
              <div className="mx-auto" style={{ maxWidth: template.orientation === "vertical" ? "360px" : "600px" }}>
                <PreviewCard
                  template={template} positions={positions}
                  visibleFields={visibleFields} activeField={activeField}
                  setActiveField={setActiveField} containerRef={previewRef}
                />

                {/* Bottom bar: Expand left + Save right */}
                <div className="flex items-center justify-between mt-3 gap-3">
                  <button
                    onClick={() => setExpanded(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold transition-all border border-gray-200 shadow-sm"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Expandir Vista
                  </button>
                  <SaveButton />
                </div>
                {saveMessage && (
                  <p className={`text-xs text-center font-medium mt-1 ${saveStatus === "saved" ? "text-green-600" : saveStatus === "error" ? "text-red-500" : "text-gray-500"}`}>
                    {saveMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Field controls (compact) */}
            <FieldControls
              template={template} positions={positions} activeField={activeField}
              visibleFields={visibleFields} setActiveField={setActiveField}
              updateField={updateField}
            />

          </CardContent>
        </Card>
      </div>

      {/* ── EXPANDED MODAL ────────────────────────────────────────────────────── */}
      {expanded && (
        <div
          className="fixed inset-0 z-[200] flex items-stretch bg-black/70 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setExpanded(false); }}
        >
          <div className="relative flex flex-col w-full h-full bg-[#f7f4f0] overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-primary" />
                <span className="font-bold text-gray-800 text-sm">Calibrador Expandido — {template.name}</span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Modo Preciso</span>
              </div>
              <div className="flex items-center gap-3">
                <SaveButton />
                <button onClick={() => setExpanded(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold transition-all border border-gray-200">
                  <Minimize2 className="w-4 h-4" /> Cerrar (Esc)
                </button>
              </div>
            </div>

            {/* Body: preview + controls side by side */}
            <div className="flex flex-1 overflow-hidden">

              {/* Preview large */}
              <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
                <div style={{
                  width: template.orientation === "vertical" ? "min(500px, 45vh)" : "min(760px, 60vw)",
                  flexShrink: 0,
                }}>
                  <PreviewCard
                    template={template} positions={positions}
                    visibleFields={visibleFields} activeField={activeField}
                    setActiveField={setActiveField} containerRef={expandedPreviewRef}
                  />
                  <p className="text-xs text-center text-gray-400 mt-3">
                    Haz clic en un elemento de la tarjeta para seleccionarlo.
                  </p>
                </div>
              </div>

              {/* Controls panel */}
              <div className="w-[360px] flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto p-6 space-y-6">
                {/* Template selector */}
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Diseño</p>
                  <div className="flex flex-wrap gap-1.5">
                    {templateIds.map(id => (
                      <button key={id} onClick={() => handleTemplateChange(id)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                          selectedId === id ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary/40"
                        }`}
                      >
                        {GIFT_CARD_TEMPLATES[id].name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex gap-2">
                  <button onClick={() => { setClipboard({ positions: { ...positions }, hasMessage }); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-all border border-gray-200">
                    <Copy className="w-3 h-3" /> Copiar
                  </button>
                  <button onClick={() => { if (clipboard) { setPositions(clipboard.positions); setHasMessage(clipboard.hasMessage); } }}
                    disabled={!clipboard}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${clipboard ? "bg-[#C5A880]/10 text-[#C5A880] border-[#C5A880]/30" : "bg-gray-50 text-gray-300 border-transparent cursor-not-allowed"}`}>
                    <ClipboardPaste className="w-3 h-3" /> Pegar
                  </button>
                  <button onClick={() => setHasMessage(!hasMessage)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${hasMessage ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                    <MessageSquare className="w-3 h-3" />
                    Msg {hasMessage ? "ON" : "OFF"}
                  </button>
                </div>

                <FieldControls
                  template={template} positions={positions} activeField={activeField}
                  visibleFields={visibleFields} setActiveField={setActiveField}
                  updateField={updateField} compact
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
