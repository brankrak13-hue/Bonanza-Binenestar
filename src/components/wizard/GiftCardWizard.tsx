"use client";

import { useState, useRef, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowLeft, Loader2, Sparkles, Check, Image as ImageIcon, ShieldCheck } from "lucide-react";
import { GIFT_CARD_TEMPLATES, GiftCardTemplateId } from "@/lib/gift-cards";
import { validateName } from "@/lib/name-filter";
import { useAuthContext } from "@/supabase/provider";
import {
  Modal,
  ModalTrigger,
  ModalBody,
  ModalContent,
  ModalFooter,
  useModal,
} from "@/components/ui/animated-modal";

const WizardModalFooter = ({ onAccept }: { onAccept: () => void }) => {
  const { setOpen } = useModal();
  return (
    <ModalFooter className="gap-4 justify-center md:justify-end">
      <button
        onClick={(e) => { e.preventDefault(); setOpen(false); }}
        className="px-4 py-2 bg-gray-200 text-black border border-gray-300 rounded-md text-sm w-32 font-medium"
      >
        Volver
      </button>
      <button
        onClick={(e) => { e.preventDefault(); setOpen(false); onAccept(); }}
        className="bg-black text-white text-sm px-4 py-2 rounded-md font-medium border border-black w-32 hover:bg-gray-800 transition-colors"
      >
        Quiero Esta
      </button>
    </ModalFooter>
  );
};

type Occasion = "mama" | "papa" | "general" | null;
type Orientation = "horizontal" | "vertical" | null;

interface WizardData {
  occasion: Occasion;
  orientation: Orientation;
  templateId: GiftCardTemplateId | null;
  recipientName: string;
  senderName: string;
  amount: string;
  message: string;
  message2: string;
  rawMessage?: string;
  sendToRecipient: boolean;
  recipientEmail: string;
  buyerEmail?: string;
}

const TOTAL_STEPS = 9;

const defaultData: WizardData = {
  occasion: null,
  orientation: null,
  templateId: null,
  recipientName: "",
  senderName: "",
  amount: "1000",
  message: "",
  message2: "",
  sendToRecipient: false,
  recipientEmail: "",
  buyerEmail: "",
};

export function GiftCardWizard() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wizardTopRef = useRef<HTMLDivElement>(null);
  const previewCardRef = useRef<HTMLDivElement>(null);
  const [previewCardWidth, setPreviewCardWidth] = useState(400);
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<WizardData>(defaultData);
  const { user } = useAuthContext();
  const [showDevAuth, setShowDevAuth] = useState(false);
  const [devPass, setDevPass] = useState("");
  const [authError, setAuthError] = useState(false);

  // Mide el ancho real del contenedor del preview para escalar el texto igual que el calibrador
  useEffect(() => {
    const el = previewCardRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) setPreviewCardWidth(entry.contentRect.width);
    });
    obs.observe(el);
    setPreviewCardWidth(el.offsetWidth);
    return () => obs.disconnect();
  }, [step]); // re-corre cuando cambia al paso 9

  const handleDevAuth = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const VALID_PASS = 'fGsrAGCuImMYEAt["lx=E038*';
    if (devPass === VALID_PASS) {
      setShowDevAuth(false);
      handleCheckout(true);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 500);
    }
  };


  useEffect(() => {
    setIsMounted(true);
    try {
      const savedData = sessionStorage.getItem('bonanza_giftcard_data');
      const savedStep = sessionStorage.getItem('bonanza_giftcard_step');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
      if (savedStep) {
        setStep(parseInt(savedStep, 10));
      }
    } catch (e) {
      console.warn("Failed to restore wizard state", e);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      sessionStorage.setItem('bonanza_giftcard_data', JSON.stringify(data));
      sessionStorage.setItem('bonanza_giftcard_step', step.toString());
    }
  }, [data, step, isMounted]);

  useEffect(() => {
    if (step > 1 && isMounted) {
      wizardTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step, isMounted]);

  const nextStep = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const currentTemplate = data.templateId ? GIFT_CARD_TEMPLATES[data.templateId] : null;

  const handleCheckout = async (isTestMode = false) => {
    if (!currentTemplate) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/gift-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: currentTemplate.id,
          recipientName: data.recipientName.trim(),
          senderName: data.senderName.trim(),
          amount: data.amount,
          message: data.message.trim(),
          message2: data.message2.trim(),
          recipientEmail: data.sendToRecipient && data.recipientEmail.trim() ? data.recipientEmail.trim() : null,
          userEmail: user?.email || (data as any).buyerEmail || null,
          isDevBypass: isTestMode,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Algo salió mal al procesar tu solicitud.');
      }

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? "80%" : "-80%",
      opacity: 0,
      scale: 0.95,
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 250, damping: 25, mass: 0.5 },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-80%" : "80%",
      opacity: 0,
      scale: 0.95,
      transition: { type: "spring", stiffness: 250, damping: 25, mass: 0.5 },
    }),
  };

  // Returns the filtered image list for the modal based on current occasion + orientation
  const getModalImages = (orientation: 'horizontal' | 'vertical'): string[] => {
    if (orientation === 'horizontal') {
      const prefix = data.occasion ?? 'general';
      return [
        GIFT_CARD_TEMPLATES[`${prefix}-horizontal-con` as GiftCardTemplateId]?.imagePath,
        GIFT_CARD_TEMPLATES[`${prefix}-horizontal-sin` as GiftCardTemplateId]?.imagePath,
      ].filter(Boolean) as string[];
    } else {
      return [
        GIFT_CARD_TEMPLATES['vertical-1']?.imagePath,
        GIFT_CARD_TEMPLATES['vertical-2']?.imagePath,
      ].filter(Boolean) as string[];
    }
  };

  // Returns design options for Step 3
  const getDesignOptions = () => {
    if (data.orientation === 'horizontal') {
      const prefix = data.occasion ?? 'general';
      return [
        {
          id: `${prefix}-horizontal-con` as GiftCardTemplateId,
          label: 'Con Detalle',
          description: 'Incluye texto decorativo impreso en la tarjeta',
          img: GIFT_CARD_TEMPLATES[`${prefix}-horizontal-con` as GiftCardTemplateId]?.imagePath,
        },
        {
          id: `${prefix}-horizontal-sin` as GiftCardTemplateId,
          label: 'Versión Limpia',
          description: 'Diseño minimalista sin texto extra',
          img: GIFT_CARD_TEMPLATES[`${prefix}-horizontal-sin` as GiftCardTemplateId]?.imagePath,
        },
      ];
    } else {
      return [
        {
          id: 'vertical-1' as GiftCardTemplateId,
          label: 'Diseño Clásico',
          description: 'Estilo floral, elegante y cálido',
          img: GIFT_CARD_TEMPLATES['vertical-1']?.imagePath,
        },
        {
          id: 'vertical-2' as GiftCardTemplateId,
          label: 'Diseño Moderno',
          description: 'Estilo limpio y sofisticado',
          img: GIFT_CARD_TEMPLATES['vertical-2']?.imagePath,
        },
      ];
    }
  };

  const renderStepContent = () => {
    switch (step) {

      // ─── PASO 1: Ocasión ────────────────────────────────────────
      case 1:
        return (
          <div className="flex flex-col h-full justify-center space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-headline text-[#2e4d41] mb-4">¿Para quién es este regalo?</h2>
              <p className="text-gray-500 text-lg">Elige la ocasión o dedicatoria principal</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
              {[
                { id: "mama" as Occasion, label: "Para Mamá", icon: "🌸" },
                { id: "papa" as Occasion, label: "Para Papá", icon: "👨" },
                { id: "general" as Occasion, label: "General / Para Ti", icon: "✨" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setData({ ...data, occasion: opt.id });
                    setTimeout(nextStep, 200);
                  }}
                  className={`p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-4 hover:shadow-xl group
                    ${data.occasion === opt.id ? 'border-[#C5A880] bg-[#fdfaf5]' : 'border-gray-100 hover:border-[#C5A880]/40 bg-white'}
                  `}
                >
                  <span className="text-5xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                  <span className="text-xl font-medium text-gray-800">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      // ─── PASO 2: Orientación ─────────────────────────────────────
      case 2: {
        const horizImages = getModalImages('horizontal');
        const vertImages  = getModalImages('vertical');

        const horizPreviewImg = data.occasion
          ? GIFT_CARD_TEMPLATES[`${data.occasion}-horizontal-con` as GiftCardTemplateId]?.imagePath
          : GIFT_CARD_TEMPLATES['general-horizontal-con']?.imagePath;

        const vertPreviewImg = GIFT_CARD_TEMPLATES['vertical-1']?.imagePath;

        return (
          <div className="flex flex-col h-full justify-center space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-headline text-[#2e4d41] mb-4">¿Qué orientación prefieres?</h2>
              <p className="text-gray-500 text-lg">Selecciona el formato de la tarjeta de regalo</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">

              {/* Horizontal */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => {
                    setData({ ...data, orientation: "horizontal", templateId: null });
                    setTimeout(nextStep, 200);
                  }}
                  className={`w-full flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-300 hover:shadow-xl group
                    ${data.orientation === "horizontal" ? 'border-[#C5A880] bg-[#fdfaf5]' : 'border-gray-100 hover:border-[#C5A880]/40 bg-white'}
                  `}
                >
                  <div className="w-full aspect-[1.5] relative rounded-xl overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
                    {horizPreviewImg
                      ? <img src={horizPreviewImg} alt="Horizontal" className="object-cover w-full h-full" />
                      : <ImageIcon className="text-gray-400 w-12 h-12" />
                    }
                  </div>
                  <span className="text-xl font-medium text-gray-800">Tarjeta Horizontal</span>
                </button>

                <div className="mt-4 w-full flex justify-center px-4" onClick={(e) => e.stopPropagation()}>
                  <Modal>
                    <ModalTrigger className="w-full bg-[#fdfaf5] border border-[#C5A880]/30 hover:bg-[#C5A880]/10 text-gray-800 flex justify-center group/modal-btn py-3 rounded-xl transition-colors overflow-hidden">
                      <span className="group-hover/modal-btn:translate-x-40 group-hover/modal-btn:opacity-0 text-center transition duration-500 font-medium flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-[#C5A880]" />
                        <span>Ver Ejemplos</span>
                      </span>
                      <div className="-translate-x-40 opacity-0 group-hover/modal-btn:translate-x-0 group-hover/modal-btn:opacity-100 flex items-center justify-center absolute inset-0 transition duration-500 z-20 text-xl">
                        ↔️
                      </div>
                    </ModalTrigger>
                    <ModalBody>
                      <ModalContent>
                        <h4 className="text-xl md:text-2xl text-neutral-600 font-bold text-center mb-12">
                          Ejemplos en formato <span className="text-[#C5A880]">Horizontal</span>
                        </h4>
                        <div className="flex justify-center items-center mb-8">
                          {horizImages.map((img, idx) => (
                            <m.div
                              key={"horiz-" + idx}
                              style={{ rotate: Math.random() * 20 - 10 }}
                              whileHover={{ scale: 1.1, rotate: 0, zIndex: 100 }}
                              className="rounded-xl -mr-4 mt-4 p-1 bg-white border border-neutral-100 shrink-0 overflow-hidden shadow-sm"
                            >
                              <img src={img} alt="preview horizontal" className="rounded-lg h-32 md:h-48 object-cover shrink-0 aspect-[1.5]" />
                            </m.div>
                          ))}
                        </div>
                        <p className="text-center mt-4 text-gray-500 max-w-sm mx-auto text-sm">
                          Al seleccionar esta orientación, podrás elegir el diseño exacto en el siguiente paso.
                        </p>
                      </ModalContent>
                      <WizardModalFooter onAccept={() => {
                        setData({ ...data, orientation: "horizontal", templateId: null });
                        setTimeout(nextStep, 200);
                      }} />
                    </ModalBody>
                  </Modal>
                </div>
              </div>

              {/* Vertical */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => {
                    setData({ ...data, orientation: "vertical", templateId: null });
                    setTimeout(nextStep, 200);
                  }}
                  className={`w-full flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-300 hover:shadow-xl group
                    ${data.orientation === "vertical" ? 'border-[#C5A880] bg-[#fdfaf5]' : 'border-gray-100 hover:border-[#C5A880]/40 bg-white'}
                  `}
                >
                  <div className="h-64 aspect-[0.75] relative rounded-xl overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
                    {vertPreviewImg
                      ? <img src={vertPreviewImg} alt="Vertical" className="object-cover w-full h-full" />
                      : <ImageIcon className="text-gray-400 w-12 h-12" />
                    }
                  </div>
                  <span className="text-xl font-medium text-gray-800">Tarjeta Vertical</span>
                </button>

                <div className="mt-4 w-full flex justify-center px-4" onClick={(e) => e.stopPropagation()}>
                  <Modal>
                    <ModalTrigger className="w-full bg-[#fdfaf5] border border-[#C5A880]/30 hover:bg-[#C5A880]/10 text-gray-800 flex justify-center group/modal-btn py-3 rounded-xl transition-colors overflow-hidden">
                      <span className="group-hover/modal-btn:translate-x-40 group-hover/modal-btn:opacity-0 text-center transition duration-500 font-medium flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-[#C5A880]" />
                        <span>Ver Ejemplos</span>
                      </span>
                      <div className="-translate-x-40 opacity-0 group-hover/modal-btn:translate-x-0 group-hover/modal-btn:opacity-100 flex items-center justify-center absolute inset-0 transition duration-500 z-20 text-xl">
                        ↕️
                      </div>
                    </ModalTrigger>
                    <ModalBody>
                      <ModalContent>
                        <h4 className="text-xl md:text-2xl text-neutral-600 font-bold text-center mb-12">
                          Ejemplos en formato <span className="text-[#C5A880]">Vertical</span>
                        </h4>
                        <div className="flex justify-center items-center mb-8">
                          {vertImages.map((img, idx) => (
                            <m.div
                              key={"vert-" + idx}
                              style={{ rotate: Math.random() * 20 - 10 }}
                              whileHover={{ scale: 1.1, rotate: 0, zIndex: 100 }}
                              className="rounded-xl -mr-4 mt-4 p-1 bg-white border border-neutral-100 shrink-0 overflow-hidden shadow-sm"
                            >
                              <img src={img} alt="preview vertical" className="rounded-lg h-40 md:h-56 object-cover shrink-0 aspect-[0.75]" />
                            </m.div>
                          ))}
                        </div>
                        <p className="text-center mt-4 text-gray-500 max-w-sm mx-auto text-sm">
                          Al seleccionar esta orientación, podrás elegir el diseño exacto en el siguiente paso.
                        </p>
                      </ModalContent>
                      <WizardModalFooter onAccept={() => {
                        setData({ ...data, orientation: "vertical", templateId: null });
                        setTimeout(nextStep, 200);
                      }} />
                    </ModalBody>
                  </Modal>
                </div>
              </div>

            </div>
          </div>
        );
      }

      // ─── PASO 3 (NUEVO): Selección de Diseño Específico ─────────
      case 3: {
        const designOptions = getDesignOptions();
        const isHoriz = data.orientation === 'horizontal';

        return (
          <div className="flex flex-col h-full justify-center space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-headline text-[#2e4d41] mb-4">¿Qué diseño prefieres?</h2>
              <p className="text-gray-500 text-lg">Elige la versión exacta de tu tarjeta de regalo</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
              {designOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setData({ ...data, templateId: opt.id });
                    setTimeout(nextStep, 200);
                  }}
                  className={`flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-300 hover:shadow-xl group
                    ${data.templateId === opt.id ? 'border-[#C5A880] bg-[#fdfaf5]' : 'border-gray-100 hover:border-[#C5A880]/40 bg-white'}
                  `}
                >
                  {isHoriz ? (
                    <div className="w-full aspect-[1.5] relative rounded-xl overflow-hidden mb-4 bg-white flex items-center justify-center shadow-md border border-gray-200/60">
                      {opt.img
                        ? <img src={opt.img} alt={opt.label} className="object-cover w-full h-full" />
                        : <ImageIcon className="text-gray-400 w-12 h-12" />
                      }
                    </div>
                  ) : (
                    <div className="h-64 aspect-[0.75] relative rounded-xl overflow-hidden mb-4 bg-white flex items-center justify-center shadow-md border border-gray-200/60">
                      {opt.img
                        ? <img src={opt.img} alt={opt.label} className="object-cover w-full h-full" />
                        : <ImageIcon className="text-gray-400 w-12 h-12" />
                      }
                    </div>
                  )}
                  <span className="text-xl font-semibold text-gray-800 mt-2">{opt.label}</span>
                  <span className="text-sm text-gray-400 mt-1 text-center">{opt.description}</span>
                </button>
              ))}
            </div>
          </div>
        );
      }

      // ─── PASO 4: Nombre del Destinatario ────────────────────────
      case 4: {
        const recipientError = validateName(data.recipientName);
        return (
          <div className="flex flex-col h-full justify-center max-w-2xl mx-auto w-full space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-headline text-[#2e4d41] mb-4">¿Para quién es este regalo?</h2>
              <p className="text-gray-500 text-lg">Ingresa el nombre de la afortunada persona</p>
            </div>
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={data.recipientName}
                onChange={(e) => setData({ ...data, recipientName: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && data.recipientName && !recipientError && nextStep()}
                className={`w-full text-center text-3xl md:text-5xl font-light text-gray-800 border-none bg-transparent border-b-2 py-4 placeholder-gray-300 outline-none transition-colors ${
                  recipientError ? 'border-red-400' : 'border-gray-200 focus:border-[#C5A880]'
                }`}
                placeholder="Ej. Ana García"
              />
              {recipientError && (
                <p className="text-center text-red-400 text-sm mt-3">{recipientError}</p>
              )}
            </div>
            <div className="flex justify-center pt-8">
              <button
                disabled={!data.recipientName.trim() || !!recipientError}
                onClick={nextStep}
                className="wizard-btn flex items-center space-x-2 bg-[#C5A880] text-white px-8 py-4 rounded-full font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <span>Continuar</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      }

      // ─── PASO 5: Nombre del Remitente ────────────────────────────
      case 5: {
        const senderError = validateName(data.senderName);
        return (
          <div className="flex flex-col h-full justify-center max-w-2xl mx-auto w-full space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-headline text-[#2e4d41] mb-4">¿De parte de quién?</h2>
              <p className="text-gray-500 text-lg">Tu nombre aparecerá en la tarjeta</p>
            </div>
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={data.senderName}
                onChange={(e) => setData({ ...data, senderName: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && data.senderName && !senderError && nextStep()}
                className={`w-full text-center text-3xl md:text-5xl font-light text-gray-800 border-none bg-transparent border-b-2 py-4 placeholder-gray-300 outline-none transition-colors ${
                  senderError ? 'border-red-400' : 'border-gray-200 focus:border-[#C5A880]'
                }`}
                placeholder="Tu nombre o apodo"
              />
              {senderError && (
                <p className="text-center text-red-400 text-sm mt-3">{senderError}</p>
              )}
            </div>
            <div className="flex justify-center pt-8">
              <button
                disabled={!data.senderName.trim() || !!senderError}
                onClick={nextStep}
                className="wizard-btn flex items-center space-x-2 bg-[#C5A880] text-white px-8 py-4 rounded-full font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <span>Continuar</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      }

      // ─── PASO 6: Monto ───────────────────────────────────────────
      case 6:
        return (
          <div className="flex flex-col h-full justify-center max-w-2xl mx-auto w-full space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-headline text-[#2e4d41] mb-4">¿De cuánto será el regalo?</h2>
              <p className="text-gray-500 text-lg">Selecciona o escribe el monto en MXN</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
              {['800', '1000', '1200', '2500'].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setData({ ...data, amount: val });
                    setTimeout(nextStep, 200);
                  }}
                  className={`py-4 rounded-2xl border-2 font-medium text-lg transition-all ${
                    data.amount === val
                      ? 'border-[#C5A880] bg-[#C5A880] text-white shadow-md'
                      : 'border-gray-200 text-gray-600 hover:border-[#C5A880]/50'
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>

            <div className="relative max-w-sm mx-auto w-full">
              <div className={`relative flex items-center bg-white rounded-2xl border-2 shadow-sm transition-all duration-300 px-6 py-5
                ${data.amount && !['800','1000','1200','2500'].includes(data.amount)
                  ? 'border-[#C5A880] shadow-[0_0_0_4px_rgba(197,168,128,0.12)]'
                  : 'border-gray-200 hover:border-[#C5A880]/40'
                }`}
              >
                <span className="absolute left-6 text-2xl font-light text-[#C5A880] select-none pointer-events-none">$</span>
                <input
                  type="number"
                  min="100"
                  value={data.amount}
                  onChange={(e) => setData({ ...data, amount: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && Number(data.amount) >= 100 && nextStep()}
                  className="w-full text-center text-3xl font-bold text-gray-800 bg-transparent outline-none placeholder-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Otro monto"
                />
              </div>
              {data.amount && Number(data.amount) < 100 && (
                <p className="text-center text-red-400 text-sm mt-2">El monto mínimo es $100 MXN</p>
              )}
            </div>

            <div className="flex justify-center pt-8">
              <button
                disabled={!data.amount || Number(data.amount) < 100}
                onClick={nextStep}
                className="wizard-btn flex items-center space-x-2 bg-[#C5A880] text-white px-8 py-4 rounded-full font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <span>Continuar</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

      // ─── PASO 7: Dedicatoria ─────────────────────────────────────
      case 7:
        return (
          <div className="flex flex-col h-full justify-center max-w-3xl mx-auto w-full space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-headline text-[#2e4d41] mb-4">Añade una Dedicatoria Especial</h2>
              <p className="text-gray-500 text-lg">OPCIONAL: Escribe unas palabras desde el corazón.<br/>Llegarán en formato de carta junto con la tarjeta.</p>
            </div>
            <div className="w-full">
              <textarea
                value={data.rawMessage ?? (data.message + (data.message2 ? ' ' + data.message2 : ''))}
                onChange={(e) => {
                  const val = e.target.value;
                  const isVertical = currentTemplate?.orientation === 'vertical';
                  
                  if (isVertical) {
                    if (val.length > 28) {
                      // Buscar el último espacio antes del límite de 28 caracteres
                      let cutIndex = val.substring(0, 29).lastIndexOf(' ');
                      if (cutIndex === -1 || cutIndex > 28) cutIndex = 28;
                      
                      const line1 = val.substring(0, cutIndex).trim();
                      const line2 = val.substring(cutIndex).trim().substring(0, 59);
                      setData({ ...data, rawMessage: val, message: line1, message2: line2 });
                    } else {
                      setData({ ...data, rawMessage: val, message: val, message2: '' });
                    }
                  } else {
                    setData({ ...data, rawMessage: val, message: val, message2: '' });
                  }
                }}
                className="w-full p-6 text-xl text-gray-700 bg-white border-2 border-gray-100 rounded-3xl focus:border-[#C5A880] focus:ring-0 outline-none resize-none shadow-sm transition-colors h-48"
                placeholder={`Escribe aquí tu dedicatoria especial...`}
              />
              <div className="mt-2 flex justify-between text-xs text-gray-400 font-medium px-2">
                <span>
                  {currentTemplate?.orientation === 'vertical' 
                    ? `Límite: L1(28), L2(59) caracteres. División inteligente activa.` 
                    : 'Todo el mensaje se mostrará en un solo bloque'}
                </span>
                <span>{(data.message + (data.message2 ? ' ' + data.message2 : '')).length} caracteres</span>
              </div>
            </div>
            <div className="flex justify-between items-center w-full pt-4">
              <button onClick={nextStep} className="text-gray-500 hover:text-gray-800 underline decoration-gray-300 font-medium">
                Omitir
              </button>
              <button
                onClick={nextStep}
                className="wizard-btn flex items-center space-x-2 bg-[#C5A880] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg"
              >
                <span>Continuar</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

      // ─── PASO 8: Entrega ─────────────────────────────────────────
      case 8:
        return (
          <div className="flex flex-col h-full justify-center max-w-2xl mx-auto w-full space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-headline text-[#2e4d41] mb-4">¿A dónde enviamos la sorpresa?</h2>
              <p className="text-gray-500 text-lg">Decide si quieres que le llegue directo o si la quieres para ti (para imprimirla o reenviarla)</p>
            </div>

            <div className="flex flex-col space-y-6 pt-4">
              <button
                onClick={() => setData({ ...data, sendToRecipient: false })}
                className={`p-6 rounded-3xl border-2 text-left transition-all relative ${
                  !data.sendToRecipient
                    ? 'border-[#2e4d41] bg-[#2e4d41]/5 shadow-md'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                {!data.sendToRecipient && (
                  <div className="absolute top-6 right-6 text-[#2e4d41]"><Check className="w-6 h-6" /></div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enviar a mi correo (Comprador)</h3>
                <p className="text-gray-500 mb-3">Recibirás la tarjeta y tú te encargas de imprimirla o enviársela por WhatsApp.</p>

                {!data.sendToRecipient && (
                  <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                    {user?.email ? (
                      <div className="flex items-center gap-3 bg-[#2e4d41]/10 rounded-xl px-4 py-3">
                        <Check className="w-4 h-4 text-[#2e4d41] flex-shrink-0" />
                        <div>
                          <p className="text-xs text-[#2e4d41]/60 font-bold uppercase tracking-widest">Se enviará a</p>
                          <p className="text-sm font-bold text-[#2e4d41]">{user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-amber-600 font-bold uppercase tracking-widest">
                          ⚠️ No tienes sesión — ingresa tu correo
                        </p>
                        <input
                          type="email"
                          autoFocus
                          value={(data as any).buyerEmail || ''}
                          onChange={(e) => setData({ ...data, buyerEmail: e.target.value } as any)}
                          className="w-full p-4 rounded-xl border border-[#2e4d41]/30 bg-white shadow-inner focus:border-[#2e4d41] focus:ring-1 focus:ring-[#2e4d41] outline-none"
                          placeholder="tu@correo.com"
                        />
                      </div>
                    )}
                  </div>
                )}
              </button>

              <button
                onClick={() => setData({ ...data, sendToRecipient: true })}
                className={`p-6 rounded-3xl border-2 text-left transition-all ${
                  data.sendToRecipient
                    ? 'border-[#C5A880] bg-[#C5A880]/5 shadow-md relative'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                {data.sendToRecipient && (
                  <div className="absolute top-6 right-6 text-[#C5A880]"><Check className="w-6 h-6" /></div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enviar directo al festejado(a)</h3>
                <p className="text-gray-500 mb-4">Ingresa su correo y le llegará la tarjeta instantáneamente tras la compra.</p>

                {data.sendToRecipient && (
                  <div className="mt-2 relative" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="email"
                      autoFocus
                      required
                      value={data.recipientEmail}
                      onChange={(e) => setData({ ...data, recipientEmail: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && data.recipientEmail && nextStep()}
                      className="w-full p-4 rounded-xl border border-[#C5A880]/30 bg-white shadow-inner focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none"
                      placeholder="Correo de quien recibe..."
                    />
                  </div>
                )}
              </button>
            </div>

            <div className="flex justify-center pt-8">
              <button
                disabled={
                  (!data.sendToRecipient && !user?.email && !((data as any).buyerEmail || '').includes('@')) ||
                  (data.sendToRecipient && !data.recipientEmail.includes('@'))
                }
                onClick={nextStep}
                className="wizard-btn flex items-center space-x-2 bg-[#C5A880] text-white px-8 py-4 rounded-full font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <span>Finalizar</span>
                <Sparkles className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        );

      // ─── PASO 9: Resumen y Pago ──────────────────────────────────
      case 9:
        return (
          <div className="flex flex-col h-full justify-center max-w-4xl mx-auto w-full">
            <div className="text-center mb-10">
              <Sparkles className="w-8 h-8 text-[#C5A880] mx-auto mb-4" />
              <h2 className="text-4xl font-headline text-[#2e4d41] mb-2">¡Todo listo!</h2>
              <p className="text-gray-500 text-lg">Confirma los detalles y procede al pago seguro</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 items-center md:items-stretch">

              {/* Contenedor de Previsualización Precisa (Layout Absoluto) */}
              <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.1)] border-4 border-gray-50 flex items-center justify-center bg-gray-100 p-2">
                {currentTemplate?.imagePath ? (
                  <div 
                    ref={previewCardRef}
                    className="relative w-full shadow-sm rounded-lg overflow-hidden ring-1 ring-black/5" 
                    style={{ aspectRatio: currentTemplate.aspectRatio }}
                  >
                    <img src={currentTemplate.imagePath} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    
                    {/* Texto sobre las líneas de la tarjeta */}
                    <div style={{ 
                      position: 'absolute', 
                      top: currentTemplate.positions.recipient.top, 
                      left: currentTemplate.positions.recipient.left, 
                      width: currentTemplate.positions.recipient.width, 
                      fontSize: `${(parseFloat(currentTemplate.positions.recipient.fontSize) / 600) * previewCardWidth}px`, 
                      color: currentTemplate.positions.recipient.color, 
                      textAlign: currentTemplate.positions.recipient.align || 'left', 
                      fontWeight: currentTemplate.positions.recipient.fontWeight || '600', 
                      lineHeight: currentTemplate.positions.recipient.lineHeight || '1.2', 
                      transform: currentTemplate.orientation === 'vertical' && currentTemplate.positions.recipient.useTopAlignment ? 'none' : 'translateY(-50%)', 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {data.recipientName}
                    </div>
                    
                    <div style={{ 
                      position: 'absolute', 
                      top: currentTemplate.positions.sender.top, 
                      left: currentTemplate.positions.sender.left, 
                      width: currentTemplate.positions.sender.width, 
                      fontSize: `${(parseFloat(currentTemplate.positions.sender.fontSize) / 600) * previewCardWidth}px`, 
                      color: currentTemplate.positions.sender.color, 
                      textAlign: currentTemplate.positions.sender.align || 'left', 
                      fontWeight: currentTemplate.positions.sender.fontWeight || '600', 
                      lineHeight: currentTemplate.positions.sender.lineHeight || '1.2', 
                      transform: currentTemplate.orientation === 'vertical' && currentTemplate.positions.sender.useTopAlignment ? 'none' : 'translateY(-50%)', 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {data.senderName}
                    </div>
                    
                    <div style={{ 
                      position: 'absolute', 
                      top: currentTemplate.positions.amount.top, 
                      left: currentTemplate.positions.amount.left, 
                      width: currentTemplate.positions.amount.width, 
                      fontSize: `${(parseFloat(currentTemplate.positions.amount.fontSize) / 600) * previewCardWidth}px`, 
                      color: currentTemplate.positions.amount.color, 
                      textAlign: currentTemplate.positions.amount.align || 'left', 
                      fontWeight: currentTemplate.positions.amount.fontWeight || '800', 
                      lineHeight: currentTemplate.positions.amount.lineHeight || '1.2', 
                      transform: currentTemplate.orientation === 'vertical' && currentTemplate.positions.amount.useTopAlignment ? 'none' : 'translateY(-50%)',
                      whiteSpace: 'nowrap'
                    }}>
                      {currentTemplate.showCurrencySymbol === false ? '' : '$'}{data.amount} MXN
                    </div>

                    {currentTemplate.hasMessageOverlay && (
                      <>
                        {data.message && (
                          <div style={{ 
                            position: 'absolute', 
                            top: currentTemplate.positions.message.top, 
                            left: currentTemplate.positions.message.left, 
                            width: currentTemplate.positions.message.width, 
                            fontSize: `${(parseFloat(currentTemplate.positions.message.fontSize) / 600) * previewCardWidth}px`, 
                            color: currentTemplate.positions.message.color, 
                            textAlign: currentTemplate.positions.message.align || 'left', 
                            fontWeight: currentTemplate.positions.message.fontWeight || '400', 
                            lineHeight: currentTemplate.positions.message.lineHeight || '1.3', 
                            transform: currentTemplate.orientation === 'vertical' && currentTemplate.positions.message.useTopAlignment ? 'none' : 'translateY(-50%)', 
                            verticalAlign: 'top', 
                            wordWrap: 'break-word', 
                            overflowWrap: 'break-word',
                            maxHeight: '15%'
                          }}>
                            {currentTemplate.orientation === 'horizontal' 
                              ? data.message + (data.message2 ? ' ' + data.message2 : '')
                              : data.message}
                          </div>
                        )}
                        {currentTemplate.orientation === 'vertical' && data.message2 && (
                          <div style={{ 
                            position: 'absolute', 
                            top: currentTemplate.positions.message2.top, 
                            left: currentTemplate.positions.message2.left, 
                            width: currentTemplate.positions.message2.width, 
                            fontSize: `${(parseFloat(currentTemplate.positions.message2.fontSize) / 600) * previewCardWidth}px`, 
                            color: currentTemplate.positions.message2.color, 
                            textAlign: currentTemplate.positions.message2.align || 'left', 
                            fontWeight: currentTemplate.positions.message2.fontWeight || '400', 
                            lineHeight: currentTemplate.positions.message2.lineHeight || '1.3', 
                            transform: currentTemplate.positions.message2.useTopAlignment ? 'none' : 'translateY(-50%)', 
                            verticalAlign: 'top', 
                            wordWrap: 'break-word', 
                            overflowWrap: 'break-word',
                            maxHeight: '15%'
                          }}>
                            {data.message2}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full aspect-[1.5] flex items-center justify-center text-gray-400 font-medium">Sin Imagen Seleccionada</div>
                )}
              </div>

              <div className="w-full md:w-1/2 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Diseño Elegido</span>
                      <div className="text-base font-semibold text-[#2e4d41]">{currentTemplate?.name ?? '—'}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Monto de Regalo</span>
                      <div className="text-3xl font-bold text-[#C5A880]">${data.amount} MXN</div>
                    </div>
                  </div>

                  {data.message && (
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Mensaje Incluido</span>
                      <p className="text-sm text-gray-600 line-clamp-3 italic">"{data.message}"</p>
                    </div>
                  )}

                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Entrega</span>
                    <div className="text-sm font-medium text-[#2e4d41] mt-1 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span>
                        {data.sendToRecipient ? `Directo a ${data.recipientEmail}` : 'A tu propio correo electrónico'}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm border border-red-100">
                    {error}
                  </div>
                )}

                <div className="mt-auto w-full flex flex-col gap-4">
                  <button
                    onClick={() => handleCheckout(false)}
                    disabled={isLoading}
                    className="w-full py-5 rounded-full bg-[#111] text-white font-bold text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:scale-[1.01] flex items-center justify-center space-x-3 group relative overflow-hidden"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin relative z-10" />
                        <span className="relative z-10">Procesando Pago Seguro...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10 tracking-widest uppercase text-sm">Pagar & Enviar Regalo</span>
                        <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </>
                    )}
                  </button>

                  {/* Dev Bypass - Discreto al final */}
                  <button
                    onClick={() => setShowDevAuth(true)}
                    disabled={isLoading}
                    className="w-full py-2 rounded-xl text-gray-300 font-medium text-[10px] hover:text-[#C5A880] transition-colors flex items-center justify-center space-x-1 uppercase tracking-tighter"
                  >
                    <span>Developer Test Mode (Skip Payment)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <>
      <div className="min-h-[80vh] flex flex-col pt-10" style={{ background: 'transparent' }}>
      {/* Scroll anchor */}
      <div ref={wizardTopRef} style={{ scrollMarginTop: '80px' }} />

      {/* Top Navigation & Progress */}
      <div className="w-full max-w-4xl mx-auto px-6 mb-12 relative z-20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevStep}
            className={`p-3 rounded-full hover:bg-gray-100 transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <ArrowLeft className="w-6 h-6 text-gray-500" />
          </button>

          <div className="text-sm font-bold tracking-widest text-[#C5A880] uppercase">
            Paso {step} de {TOTAL_STEPS}
          </div>

          <div className="w-12" />
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <m.div
            className="h-full bg-[#C5A880]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-6 relative overflow-visible z-10 py-10">
        <AnimatePresence mode="wait" custom={direction}>
          <m.div
            key={step}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            {renderStepContent()}
          </m.div>
        </AnimatePresence>
      </div>
    </div>

    {/* Dev Auth Overlay */}
    <AnimatePresence>
      {showDevAuth && (
        <m.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
        >
          <m.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              x: authError ? [0, -10, 10, -10, 10, 0] : 0
            }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl border border-gray-100"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-[#FDF8F3] rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#C5A880]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2e4d41]">Área Protegida</h3>
                <p className="text-sm text-gray-500 mt-1">Ingresa la clave de acceso para continuar en modo desarrollador.</p>
              </div>

              <form onSubmit={handleDevAuth} className="w-full space-y-4 pt-4">
                <input
                  autoFocus
                  type="password"
                  value={devPass}
                  onChange={(e) => setDevPass(e.target.value)}
                  placeholder="Contraseña Maestra"
                  className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 transition-all outline-none text-center font-mono tracking-widest ${authError ? 'border-red-400 bg-red-50 text-red-600' : 'border-transparent focus:border-[#C5A880] focus:bg-white'}`}
                />
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDevAuth(false);
                      setDevPass("");
                      setAuthError(false);
                    }}
                    className="flex-1 py-4 rounded-2xl text-gray-400 font-bold text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 rounded-2xl bg-[#C5A880] text-white font-bold text-sm hover:bg-[#b0946d] transition-colors shadow-lg shadow-[#C5A880]/20"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  </>
  );
}
