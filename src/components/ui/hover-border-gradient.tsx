"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

// Colores Bonanza extraídos del design system:
// --primary: hsl(163, 45%, 35%)  → teal-verde oscuro
// --accent:  hsl(40, 60%, 60%)   → dorado cálido
const BONANZA_PRIMARY = "hsl(163, 45%, 35%)";
const BONANZA_ACCENT  = "hsl(40, 60%, 60%)";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1.2,
  clockwise = true,
  type,
  disabled,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (current: Direction): Direction => {
    const dirs: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const idx = dirs.indexOf(current);
    return clockwise
      ? dirs[(idx - 1 + dirs.length) % dirs.length]
      : dirs[(idx + 1) % dirs.length];
  };

  // Borde animado: alterna entre el verde y el dorado de Bonanza
  const movingMap: Record<Direction, string> = {
    TOP:    `radial-gradient(20.7% 50% at 50% 0%,    ${BONANZA_PRIMARY} 0%, rgba(255,255,255,0) 100%)`,
    LEFT:   `radial-gradient(16.6% 43.1% at 0% 50%,  ${BONANZA_ACCENT}  0%, rgba(255,255,255,0) 100%)`,
    BOTTOM: `radial-gradient(20.7% 50% at 50% 100%,  ${BONANZA_PRIMARY} 0%, rgba(255,255,255,0) 100%)`,
    RIGHT:  `radial-gradient(16.2% 41.2% at 100% 50%, ${BONANZA_ACCENT}  0%, rgba(255,255,255,0) 100%)`,
  };

  // Brillo en hover: destello dorado-verde
  const highlight = `radial-gradient(75% 181% at 50% 50%, ${BONANZA_ACCENT} 0%, rgba(255,255,255,0) 100%)`;

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(
        () => setDirection((prev) => rotateDirection(prev)),
        duration * 1000
      );
      return () => clearInterval(interval);
    }
  }, [hovered]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      type={type}
      disabled={disabled}
      className={cn(
        // Contenedor: anillo exterior semi-transparente verde
        "relative flex rounded-full border border-primary/30 content-center",
        "bg-primary/10 hover:bg-primary/20 transition duration-500",
        "items-center flex-col flex-nowrap h-min justify-center overflow-visible p-px",
        "w-full",
        disabled && "opacity-70 cursor-not-allowed",
        containerClassName
      )}
      {...props}
    >
      {/* Superficie interior: fondo verde Bonanza sólido */}
      <div
        className={cn(
          "w-full text-white z-10 bg-primary px-6 py-4 rounded-[inherit]",
          "flex items-center justify-center gap-2",
          "font-bold tracking-[0.2em] uppercase text-sm",
          className
        )}
      >
        {children}
      </div>

      {/* Borde animado giratorio */}
      <motion.div
        className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        style={{ filter: "blur(2px)", position: "absolute", width: "100%", height: "100%" }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered ? [movingMap[direction], highlight] : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1.2 }}
      />

      {/* Anillo interior que crea el efecto de borde */}
      <div className="bg-primary absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
}
