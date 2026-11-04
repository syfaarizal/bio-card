"use client"

import { cn } from "@/lib/utils"

// ── Decoration definitions ────────────────────────────────────────────────────

export type DecorationId = "none" | "sakura" | "cyber" | "angel" | "ember" | "moon"

export interface Decoration {
  id: DecorationId
  name: string
  description: string
  preview: string // emoji for picker card fallback
}

export const DECORATIONS: Decoration[] = [
  { id: "none", name: "Plain", description: "Simple round border", preview: "○" },
  { id: "sakura", name: "Sakura", description: "Cherry blossom ring", preview: "🌸" },
  { id: "cyber", name: "Cyber Ring", description: "Neon glowing ring", preview: "⭕" },
  { id: "angel", name: "Angel", description: "Crimson halo ring", preview: "👼" },
  { id: "ember", name: "Ember", description: "Animated crimson ring", preview: "🔥" },
  { id: "moon", name: "Moon", description: "Pink crescent moon", preview: "🌙" },
]

// ── SVG Overlays — rendered on top of the avatar ─────────────────────────────
// Every overlay uses the same 120×120 viewBox and is stretched over the whole
// avatar box, so the avatar's outer edge is always the circle of radius 60.
// The decoration *replaces* the avatar border, which means its ring is drawn
// centred on radius 57 — a couple of units inside the edge so the stroke
// still sits on the visible rim instead of falling off the box.
//
// `overflow: visible` lets a decoration (angel feathers, the crescent moon)
// reach past the avatar box, the way Discord's do.

const RING_R = 57
const RING_W = 5

const SVG_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  overflow: "visible",
}

const polar = (radius: number, angle: number) => {
  const rad = (angle * Math.PI) / 180
  return { x: 60 + radius * Math.cos(rad), y: 60 + radius * Math.sin(rad) }
}

export function DecorationOverlay({ id }: { id: DecorationId }) {
  const svgs: Record<DecorationId, React.ReactNode> = {
    // ── PLAIN ────────────────────────────────────────────────────────────────
    // The default: nothing but the border itself.
    none: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={SVG_STYLE}>
        <circle
          cx="60"
          cy="60"
          r={RING_R}
          strokeWidth={RING_W}
          style={{ stroke: "var(--theme-ring, #94a3b8)" }}
        />
      </svg>
    ),

    // ── SAKURA ────────────────────────────────────────────────────────────────
    // A ring of cherry blossoms that takes the place of the border.
    sakura: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={SVG_STYLE}>
        <defs>
          <filter id="sakuraGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="sakuraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB7C5" />
            <stop offset="100%" stopColor="#FF6B8A" />
          </linearGradient>
        </defs>

        {/* Base ring the blossoms sit on */}
        <circle cx="60" cy="60" r={RING_R} stroke="url(#sakuraGrad)" strokeWidth="3" opacity="0.65" />

        {/* Blossoms around the rim */}
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const { x, y } = polar(RING_R, angle)
          return (
            <g key={angle} transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${angle + 90})`}>
              {[0, 72, 144, 216, 288].map((p) => {
                const rad = (p * Math.PI) / 180
                return (
                  <ellipse
                    key={p}
                    cx={(3.4 * Math.cos(rad)).toFixed(2)}
                    cy={(3.4 * Math.sin(rad)).toFixed(2)}
                    rx="2.6"
                    ry="3.4"
                    fill="#FFB7C5"
                    opacity="0.95"
                  />
                )
              })}
              <circle cx="0" cy="0" r="1.8" fill="#FFE4EC" />
              <circle cx="0" cy="0" r="0.9" fill="#FF6B8A" />
            </g>
          )
        })}

        {/* Floating petals */}
        <ellipse cx="16" cy="34" rx="5" ry="3" fill="#FFB7C5" opacity="0.7" transform="rotate(25, 16, 34)" />
        <ellipse cx="104" cy="88" rx="4" ry="2.5" fill="#FF91AA" opacity="0.7" transform="rotate(-15, 104, 88)" />
        <ellipse cx="100" cy="20" rx="3.5" ry="2.2" fill="#FFCCD5" opacity="0.6" transform="rotate(-30, 100, 20)" />
        <ellipse cx="20" cy="102" rx="3.5" ry="2.2" fill="#FF91AA" opacity="0.6" transform="rotate(40, 20, 102)" />
      </svg>
    ),

    // ── CYBER RING ────────────────────────────────────────────────────────────
    // Neon cyan/purple ring with a counter-rotating dash segment.
    cyber: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={SVG_STYLE}>
        <defs>
          <filter id="cyberGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="cyberGlowStrong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="cyberGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="cyberGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0abfc" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Outer glow */}
        <circle
          cx="60"
          cy="60"
          r={RING_R}
          stroke="url(#cyberGrad1)"
          strokeWidth={RING_W}
          opacity="0.28"
          filter="url(#cyberGlowStrong)"
        />
        {/* Main ring — this is the border */}
        <circle
          cx="60"
          cy="60"
          r={RING_R}
          stroke="url(#cyberGrad1)"
          strokeWidth={RING_W}
          filter="url(#cyberGlow)"
        />
        {/* Travelling highlight segment */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            dur="10s"
            repeatCount="indefinite"
          />
          <circle
            cx="60"
            cy="60"
            r={RING_R}
            stroke="url(#cyberGrad2)"
            strokeWidth={RING_W}
            strokeDasharray="52 306"
            filter="url(#cyberGlow)"
          />
        </g>
        {/* Diamond accents on the rim */}
        <polygon points="60,0 63.5,4 60,8 56.5,4" fill="#22d3ee" filter="url(#cyberGlow)" opacity="0.95" />
        <polygon points="60,112 63.5,116 60,120 56.5,116" fill="#a855f7" filter="url(#cyberGlow)" opacity="0.95" />
        <polygon points="0,60 4,56.5 8,60 4,63.5" fill="#22d3ee" filter="url(#cyberGlow)" opacity="0.9" />
        <polygon points="112,60 116,56.5 120,60 116,63.5" fill="#a855f7" filter="url(#cyberGlow)" opacity="0.9" />
        {/* Small dots */}
        <circle cx="60" cy="4" r="2" fill="#22d3ee" filter="url(#cyberGlowStrong)" />
        <circle cx="116" cy="60" r="1.8" fill="#a855f7" filter="url(#cyberGlowStrong)" />
        <circle cx="60" cy="116" r="1.8" fill="#22d3ee" filter="url(#cyberGlowStrong)" />
        <circle cx="4" cy="60" r="1.8" fill="#a855f7" filter="url(#cyberGlowStrong)" />
      </svg>
    ),

    // ── ANGEL ─────────────────────────────────────────────────────────────────
    // Crimson halo ring: solid (not dashed, unlike cyber) with feather tips
    // radiating outward at the diagonals and a light arc along the upper rim.
    angel: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={SVG_STYLE}>
        <defs>
          <filter id="angelGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="angelGlowStrong" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="angelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="50%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>
          <linearGradient id="angelFeather" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#FECDD3" />
          </linearGradient>
        </defs>

        {/* Outer glow */}
        <circle
          cx="60"
          cy="60"
          r={RING_R}
          stroke="url(#angelGrad)"
          strokeWidth={RING_W}
          opacity="0.35"
          filter="url(#angelGlowStrong)"
        />
        {/* Main solid ring — this is the border */}
        <circle
          cx="60"
          cy="60"
          r={RING_R}
          stroke="url(#angelGrad)"
          strokeWidth={RING_W}
          filter="url(#angelGlow)"
        />

        {/* Light arc along the upper rim */}
        <path
          d="M 33 20 A 57 57 0 0 1 87 20"
          stroke="#FECDD3"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.75"
          filter="url(#angelGlow)"
        />

        {/* Feather tips radiating outward at the diagonals */}
        {[45, 135, 225, 315].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 60 60) translate(0 -57)`}>
            <path d="M0,3 C-5,-2 -5,-8 0,-12 C5,-8 5,-2 0,3 Z" fill="url(#angelFeather)" filter="url(#angelGlow)" />
            <line x1="0" y1="2" x2="0" y2="-9" stroke="#FFF1F2" strokeWidth="0.8" opacity="0.7" />
          </g>
        ))}

        {/* Sparkle dots on the cardinal points */}
        <g fill="#FECDD3" filter="url(#angelGlow)">
          <circle cx="60" cy="3" r="1.8" opacity="0.9" />
          <circle cx="60" cy="117" r="1.8" opacity="0.9" />
          <circle cx="3" cy="60" r="1.8" opacity="0.9" />
          <circle cx="117" cy="60" r="1.8" opacity="0.9" />
        </g>
      </svg>
    ),

    // ── EMBER ────────────────────────────────────────────────────────────────
    // Animated crimson ring in the cyber-red & black palette: a pulsing
    // gradient band with flowing dashes and sparks running around the rim.
    ember: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={SVG_STYLE}>
        <defs>
          <filter id="emberGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="emberGlowStrong" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="emberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="45%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <linearGradient id="emberGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fecaca" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        {/* Pulsing outer glow */}
        <circle cx="60" cy="60" r={RING_R} stroke="url(#emberGrad)" strokeWidth={RING_W} opacity="0.3" filter="url(#emberGlowStrong)">
          <animate
            attributeName="opacity"
            values="0.2;0.6;0.2"
            dur="3.2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Main ring — this is the border */}
        <circle cx="60" cy="60" r={RING_R} stroke="url(#emberGrad)" strokeWidth={RING_W} filter="url(#emberGlow)" />

        {/* Flowing hot dashes */}
        <circle cx="60" cy="60" r={RING_R} stroke="url(#emberGrad2)" strokeWidth={RING_W} strokeDasharray="24 22" filter="url(#emberGlow)">
          <animate attributeName="stroke-dashoffset" from="0" to="-184" dur="2.6s" repeatCount="indefinite" />
        </circle>

        {/* Counter-rotating inner ticks */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360 60 60"
            to="0 60 60"
            dur="9s"
            repeatCount="indefinite"
          />
          <circle cx="60" cy="60" r="50" stroke="#e11d48" strokeWidth="1.6" strokeDasharray="6 16" opacity="0.8" />
        </g>

        {/* Sparks orbiting the rim */}
        <g filter="url(#emberGlow)">
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const { x, y } = polar(RING_R, angle)
            return (
              <g key={angle}>
                <circle cx={x.toFixed(2)} cy={y.toFixed(2)} r="2.2" fill="#fca5a5">
                  <animate
                    attributeName="opacity"
                    values="0.35;1;0.35"
                    dur={`${(1.6 + i * 0.24).toFixed(2)}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            )
          })}
        </g>
      </svg>
    ),

    // ── MOON ─────────────────────────────────────────────────────────────────
    // Pink crescent moon resting on a slim pink rim, with a few stars.
    moon: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={SVG_STYLE}>
        <defs>
          <filter id="moonGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde4f0" />
            <stop offset="50%" stopColor="#f9a8d4" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="moonRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>

        {/* Slim rim the moon sits on */}
        <circle cx="60" cy="60" r={RING_R} stroke="url(#moonRim)" strokeWidth="2.5" opacity="0.75" />

        {/* Crescent moon, resting on the upper-right of the rim */}
        <g transform="translate(58 8) rotate(-15)" filter="url(#moonGlow)">
          <path
            d="M 5.25 -12.94 A 14 14 0 1 0 5.25 12.94 A 13 13 0 0 1 5.25 -12.94 Z"
            fill="url(#moonGrad)"
          />
          <path
            d="M 5.25 -12.94 A 14 14 0 1 0 5.25 12.94"
            stroke="#fff1f2"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>

        {/* Stars */}
        <g fill="#fbcfe8" filter="url(#moonGlow)">
          <path d="M28 24 l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6 Z" opacity="0.9" />
          <path d="M96 40 l1.2 3.2 3.2 1.2 -3.2 1.2 -1.2 3.2 -1.2 -3.2 -3.2 -1.2 3.2 -1.2 Z" opacity="0.75" />
          <circle cx="88" cy="96" r="1.6" opacity="0.7" />
        </g>
      </svg>
    ),
  }

  return svgs[id] ?? null
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
              <DecorationOverlay id={d.id} />
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
