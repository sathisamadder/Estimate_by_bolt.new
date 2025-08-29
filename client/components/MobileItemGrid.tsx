import React from "react";
import { cn } from "@/lib/utils";

export interface GridItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  bgColor?: string;
  imageUrl?: string;
}

interface MobileItemGridProps {
  items: GridItem[];
  onPick: (id: string) => void;
  className?: string;
}

export function MobileItemGrid({
  items,
  onPick,
  className,
}: MobileItemGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-4 gap-3 p-3 rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.25)]",
        className,
      )}
    >
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => onPick(it.id)}
            className="group flex flex-col items-center gap-2"
          >
            <div className="relative w-14 h-14 rounded-full ring-1 ring-white/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] flex items-center justify-center">
              {it.imageUrl ? (
                <img
                  src={it.imageUrl}
                  alt={it.name}
                  className="w-9 h-9 object-contain"
                  loading="lazy"
                />
              ) : (
                <Icon className={cn("w-6 h-6", it.color)} />
              )}
            </div>
            <span className="text-[11px] leading-none text-gray-700 text-center line-clamp-2">
              {it.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
