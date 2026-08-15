"use client"

import { cn } from "@/lib/utils"

// ── Decoration definitions ────────────────────────────────────────────────────

export type DecorationId = "none" | "sakura" | "cyber" | "angel"

export interface Decoration {
  id: DecorationId
  name: string
  description: string
  preview: string // emoji for picker card fallback
}

export const DECORATIONS: Decoration[] = [
  { id: "none", name: "None", description: "No decoration", preview: "○" },
  { id: "sakura", name: "Sakura", description: "Cherry blossom petals", preview: "🌸" },
  { id: "cyber", name: "Cyber Ring", description: "Neon glowing ring", preview: "⭕" },
  { id: "angel", name: "Angel", description: "Golden halo & wings", preview: "👼" },
]

// ── SVG Overlays — rendered on top of the avatar ─────────────────────────────
// Each SVG uses viewBox="0 0 120 120" to match a 120×120 avatar container.
// The avatar itself sits in the center ~80×80 area.

export function DecorationOverlay({ id, size = 120 }: { id: DecorationId; size?: number }) {
  if (id === "none" || !id) return null

  const scale = size / 120

  const svgs: Record<Exclude<DecorationId, "none">, React.ReactNode> = {
    // ── SAKURA ────────────────────────────────────────────────────────────────
    // Pink cherry blossom petals scattered around the avatar ring
    sakura: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {/* Bottom left blossom */}
        <g transform="translate(12, 80) rotate(-20)">
          <circle cx="0" cy="-6" r="5" fill="#FFB7C5" opacity="0.95"/>
          <circle cx="5.7" cy="1.9" r="5" fill="#FF91AA" opacity="0.95"/>
          <circle cx="3.5" cy="9.6" r="5" fill="#FFB7C5" opacity="0.95"/>
          <circle cx="-3.5" cy="9.6" r="5" fill="#FF91AA" opacity="0.95"/>
          <circle cx="-5.7" cy="1.9" r="5" fill="#FFB7C5" opacity="0.95"/>
          <circle cx="0" cy="5" r="3" fill="#FFE4EC"/>
          <circle cx="0" cy="4" r="1.5" fill="#FF6B8A"/>
        </g>
        {/* Top right blossom */}
        <g transform="translate(104, 22) rotate(30)">
          <circle cx="0" cy="-5" r="4.5" fill="#FFB7C5" opacity="0.95"/>
          <circle cx="5" cy="1.6" r="4.5" fill="#FF91AA" opacity="0.95"/>
          <circle cx="3" cy="8.5" r="4.5" fill="#FFB7C5" opacity="0.95"/>
          <circle cx="-3" cy="8.5" r="4.5" fill="#FF91AA" opacity="0.95"/>
          <circle cx="-5" cy="1.6" r="4.5" fill="#FFB7C5" opacity="0.95"/>
          <circle cx="0" cy="4.5" r="2.5" fill="#FFE4EC"/>
          <circle cx="0" cy="3.5" r="1.2" fill="#FF6B8A"/>
        </g>
        {/* Top left small petal */}
        <g transform="translate(20, 18) rotate(15)">
          <circle cx="0" cy="-4" r="3.5" fill="#FFCCD5" opacity="0.9"/>
          <circle cx="4" cy="1.2" r="3.5" fill="#FF91AA" opacity="0.9"/>
          <circle cx="2.5" cy="7" r="3.5" fill="#FFCCD5" opacity="0.9"/>
          <circle cx="-2.5" cy="7" r="3.5" fill="#FF91AA" opacity="0.9"/>
          <circle cx="-4" cy="1.2" r="3.5" fill="#FFCCD5" opacity="0.9"/>
          <circle cx="0" cy="3.5" r="2" fill="#FFE4EC"/>
        </g>
        {/* Bottom right small petal */}
        <g transform="translate(96, 90) rotate(-10)">
          <circle cx="0" cy="-4" r="3.5" fill="#FFB7C5" opacity="0.9"/>
          <circle cx="4" cy="1.2" r="3.5" fill="#FFCCD5" opacity="0.9"/>
          <circle cx="2.5" cy="7" r="3.5" fill="#FF91AA" opacity="0.9"/>
          <circle cx="-2.5" cy="7" r="3.5" fill="#FFCCD5" opacity="0.9"/>
          <circle cx="-4" cy="1.2" r="3.5" fill="#FFB7C5" opacity="0.9"/>
          <circle cx="0" cy="3.5" r="2" fill="#FFE4EC"/>
        </g>
        {/* Floating petals */}
        <ellipse cx="35" cy="10" rx="5" ry="3" fill="#FFB7C5" opacity="0.7" transform="rotate(25, 35, 10)"/>
        <ellipse cx="85" cy="108" rx="4" ry="2.5" fill="#FF91AA" opacity="0.7" transform="rotate(-15, 85, 108)"/>
        <ellipse cx="8" cy="50" rx="4" ry="2.5" fill="#FFB7C5" opacity="0.6" transform="rotate(40, 8, 50)"/>
        <ellipse cx="112" cy="60" rx="4" ry="2.5" fill="#FFCCD5" opacity="0.6" transform="rotate(-30, 112, 60)"/>
      </svg>
    ),

    // ── CYBER RING ────────────────────────────────────────────────────────────
    // Neon cyan/purple glowing ring around the avatar
    cyber: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs>
          <filter id="cyberGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          <filter id="cyberGlowStrong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          <linearGradient id="cyberGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee"/>
            <stop offset="50%" stopColor="#a855f7"/>
            <stop offset="100%" stopColor="#22d3ee"/>
          </linearGradient>
          <linearGradient id="cyberGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0abfc"/>
            <stop offset="100%" stopColor="#06b6d4"/>
          </linearGradient>
        </defs>
        {/* Outer glow ring */}
        <circle cx="60" cy="60" r="54" stroke="url(#cyberGrad1)" strokeWidth="1.5" opacity="0.3" filter="url(#cyberGlowStrong)"/>
        {/* Main ring */}
        <circle cx="60" cy="60" r="52" stroke="url(#cyberGrad1)" strokeWidth="2.5" strokeDasharray="180 148" strokeDashoffset="-10" filter="url(#cyberGlow)"/>
        {/* Second ring segment */}
        <circle cx="60" cy="60" r="52" stroke="url(#cyberGrad2)" strokeWidth="1.5" strokeDasharray="60 268" strokeDashoffset="170" filter="url(#cyberGlow)"/>
        {/* Tick marks */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const x1 = 60 + 48 * Math.cos(rad)
          const y1 = 60 + 48 * Math.sin(rad)
          const x2 = 60 + 55 * Math.cos(rad)
          const y2 = 60 + 55 * Math.sin(rad)
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i % 2 === 0 ? "#22d3ee" : "#a855f7"}
              strokeWidth={i % 2 === 0 ? "2" : "1.2"}
              opacity="0.9"
              filter="url(#cyberGlow)"
            />
          )
        })}
        {/* Corner diamond accents */}
        <polygon points="60,4 63,8 60,12 57,8" fill="#22d3ee" filter="url(#cyberGlow)" opacity="0.95"/>
        <polygon points="60,108 63,112 60,116 57,112" fill="#a855f7" filter="url(#cyberGlow)" opacity="0.95"/>
        <polygon points="4,60 8,57 12,60 8,63" fill="#22d3ee" filter="url(#cyberGlow)" opacity="0.9"/>
        <polygon points="108,60 112,57 116,60 112,63" fill="#a855f7" filter="url(#cyberGlow)" opacity="0.9"/>
        {/* Small dots on ring */}
        <circle cx="60" cy="7" r="2.5" fill="#22d3ee" filter="url(#cyberGlowStrong)"/>
        <circle cx="113" cy="60" r="2" fill="#a855f7" filter="url(#cyberGlowStrong)"/>
        <circle cx="60" cy="113" r="2" fill="#22d3ee" filter="url(#cyberGlowStrong)"/>
        <circle cx="7" cy="60" r="2" fill="#a855f7" filter="url(#cyberGlowStrong)"/>
      </svg>
    ),

    // ── ANGEL ─────────────────────────────────────────────────────────────────
    // Golden halo above + white feathered wings on sides
    angel: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs>
          <filter id="angelGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          <filter id="haloGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          <linearGradient id="haloGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FDE68A"/>
            <stop offset="50%" stopColor="#F59E0B"/>
            <stop offset="100%" stopColor="#FDE68A"/>
          </linearGradient>
          <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#E8E8FF" stopOpacity="0.7"/>
          </linearGradient>
        </defs>

        {/* ── Left wing ── */}
        <g transform="translate(4, 42)" opacity="0.95">
          {/* Main feather shape */}
          <path d="M28,30 Q8,22 2,8 Q12,14 20,10 Q10,20 28,30Z" fill="url(#wingGrad)" filter="url(#angelGlow)"/>
          <path d="M28,30 Q6,26 4,14 Q14,18 20,14 Q12,22 28,30Z" fill="white" opacity="0.8" filter="url(#angelGlow)"/>
          <path d="M28,30 Q10,30 8,20 Q16,22 22,20 Q16,26 28,30Z" fill="white" opacity="0.7" filter="url(#angelGlow)"/>
          {/* Feather quill lines */}
          <line x1="28" y1="30" x2="12" y2="10" stroke="white" strokeWidth="0.5" opacity="0.5"/>
          <line x1="28" y1="30" x2="8" y2="16" stroke="white" strokeWidth="0.5" opacity="0.5"/>
          <line x1="28" y1="30" x2="10" y2="22" stroke="white" strokeWidth="0.5" opacity="0.5"/>
        </g>

        {/* ── Right wing ── */}
        <g transform="translate(92, 42) scale(-1,1)" opacity="0.95">
          <path d="M28,30 Q8,22 2,8 Q12,14 20,10 Q10,20 28,30Z" fill="url(#wingGrad)" filter="url(#angelGlow)"/>
          <path d="M28,30 Q6,26 4,14 Q14,18 20,14 Q12,22 28,30Z" fill="white" opacity="0.8" filter="url(#angelGlow)"/>
          <path d="M28,30 Q10,30 8,20 Q16,22 22,20 Q16,26 28,30Z" fill="white" opacity="0.7" filter="url(#angelGlow)"/>
          <line x1="28" y1="30" x2="12" y2="10" stroke="white" strokeWidth="0.5" opacity="0.5"/>
          <line x1="28" y1="30" x2="8" y2="16" stroke="white" strokeWidth="0.5" opacity="0.5"/>
          <line x1="28" y1="30" x2="10" y2="22" stroke="white" strokeWidth="0.5" opacity="0.5"/>
        </g>

        {/* ── Halo ── */}
        {/* Outer glow */}
        <ellipse cx="60" cy="14" rx="22" ry="7" stroke="#F59E0B" strokeWidth="1" opacity="0.4" filter="url(#haloGlow)"/>
        {/* Main halo ring */}
        <ellipse cx="60" cy="14" rx="19" ry="5.5" stroke="url(#haloGrad)" strokeWidth="3.5" filter="url(#angelGlow)" opacity="0.98"/>
        {/* Inner highlight */}
        <ellipse cx="60" cy="13" rx="16" ry="3.5" stroke="#FDE68A" strokeWidth="1" opacity="0.5"/>
        {/* Sparkle dots on halo */}
        <circle cx="41" cy="14" r="1.5" fill="#FDE68A" filter="url(#haloGlow)" opacity="0.9"/>
        <circle cx="79" cy="14" r="1.5" fill="#FDE68A" filter="url(#haloGlow)" opacity="0.9"/>
        <circle cx="60" cy="8.5" r="1.2" fill="#FFF8DC" filter="url(#haloGlow)" opacity="0.8"/>
      </svg>
    ),
  }

  return svgs[id as Exclude<DecorationId, "none">] ?? null
}

// ── Decoration Picker Card ────────────────────────────────────────────────────

interface DecorPickerProps {
  current: DecorationId | null
  onSelect: (id: DecorationId) => void
}

export function AvatarDecorationPicker({ current, onSelect }: DecorPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {DECORATIONS.map((d) => {
        const isSelected = (current ?? "none") === d.id
        return (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-xl border p-3 transition-all text-left",
              isSelected
                ? "border-gray-900 bg-gray-50 dark:border-zinc-300 dark:bg-zinc-900"
                : "border-gray-200 hover:border-gray-400 hover:bg-gray-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            )}
          >
            {/* Mini avatar preview with decoration */}
            <div className="relative w-16 h-16 flex-shrink-0">
              {/* Avatar placeholder */}
              <div className="w-full h-full rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden">
                <span className="text-2xl opacity-40">👤</span>
              </div>
              {/* Decoration overlay */}
              {d.id !== "none" && (
                <DecorationOverlay id={d.id} size={64} />
              )}
            </div>

            {/* Name */}
            <p className="text-xs font-semibold text-gray-900 dark:text-zinc-100 text-center leading-tight">
              {d.name}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 text-center leading-tight">
              {d.description}
            </p>

            {/* Selected indicator */}
            {isSelected && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gray-900 dark:bg-white" />
            )}
          </button>
        )
      })}
    </div>
  )
}
