"use client";
import React, { useState, useEffect } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

// Colores Bonanza — verde teal y dorado cálido
const BONANZA_GREEN  = "hsl(163, 55%, 50%)";
const BONANZA_GOLD   = "hsl(40, 80%, 65%)";
const BONANZA_BRIGHT = "hsl(163, 70%, 60%)";

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
    href?: string;
    target?: string;
    rel?: string;
  } & React.AllHTMLAttributes<HTMLElement>
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

  // Gradiente giratorio: colores brillantes que se ven sobre el fondo oscuro del anillo
  const movingMap: Record<Direction, string> = {
    TOP:    `radial-gradient(22% 55% at 50% 0%,    ${BONANZA_GOLD}  0%, transparent 100%)`,
    LEFT:   `radial-gradient(18% 45% at 0% 50%,    ${BONANZA_GREEN} 0%, transparent 100%)`,
    BOTTOM: `radial-gradient(22% 55% at 50% 100%,  ${BONANZA_GOLD}  0%, transparent 100%)`,
    RIGHT:  `radial-gradient(18% 45% at 100% 50%,  ${BONANZA_GREEN} 0%, transparent 100%)`,
  };

  // Destello en hover: verde brillante que envuelve todo el borde
  const highlight = `radial-gradient(75% 181% at 50% 50%, ${BONANZA_BRIGHT} 0%, transparent 100%)`;

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
        // Contenedor externo: transparente para que solo se vea el gradiente animado como borde
        "relative flex rounded-2xl content-center",
        "items-center flex-col flex-nowrap h-min justify-center overflow-hidden",
        "p-[3px] w-full", // p-[3px] = grosor del borde visible
        disabled && "opacity-70 cursor-not-allowed",
        containerClassName
      )}
      {...props}
    >
      {/* Superficie interior verde Bonanza — sobre el fondo transparente del borde */}
      <div
        className={cn(
          "relative w-full text-white z-10 bg-primary px-6 py-4 rounded-xl",
          "flex items-center justify-center gap-2",
          "font-bold tracking-[0.2em] uppercase text-sm",
          "transition-all duration-300",
          hovered ? "bg-primary/90" : "bg-primary",
          className
        )}
      >
        {children}
      </div>

      {/* Gradiente animado que ocupa TODO el contenedor — se ve en los 3px del borde */}
      <m.div
        className="absolute inset-0 z-0 rounded-[inherit]"
        style={{ filter: "blur(3px)", width: "100%", height: "100%" }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered ? [movingMap[direction], highlight] : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1.2 }}
      />
    </Tag>
  );
}
