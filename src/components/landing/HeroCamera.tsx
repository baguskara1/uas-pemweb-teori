/**
 * HeroCamera — detailed SVG camera illustration.
 * Static (no JS animation). Float handled by pure CSS @keyframes (GPU compositor only).
 * Halo is a static soft gradient (no blur filter, cheap on mobile).
 */
export function HeroCamera() {
  return (
    <div className="relative flex min-h-[420px] items-center justify-center [perspective:1200px]" aria-hidden="true">
      {/* Static soft halo — radial gradient, no filter:blur */}
      <div
        className="absolute h-72 w-72 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,113,227,0.18) 0%, rgba(0,113,227,0) 70%)',
        }}
      />

      <div className="hero-float relative">
        <svg
          width="380"
          height="280"
          viewBox="0 0 380 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_35px_90px_rgba(0,0,0,0.18)]"
        >
          <defs>
            <linearGradient
              id="bodyGrad"
              x1="50"
              y1="40"
              x2="330"
              y2="240"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2a2a2c" />
              <stop offset="1" stopColor="#18181a" />
            </linearGradient>
            <linearGradient
              id="topGrad"
              x1="120"
              y1="20"
              x2="260"
              y2="60"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3a3a3d" />
              <stop offset="1" stopColor="#272729" />
            </linearGradient>
            <radialGradient id="lensGrad" cx="190" cy="150" r="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3a3a3d" />
              <stop offset="0.7" stopColor="#18181a" />
              <stop offset="1" stopColor="#0c0c0e" />
            </radialGradient>
            <radialGradient
              id="glassGrad"
              cx="184"
              cy="144"
              r="42"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#1a4d8c" />
              <stop offset="0.7" stopColor="#0a1f3d" />
              <stop offset="1" stopColor="#050a14" />
            </radialGradient>
            <linearGradient
              id="highlightGrad"
              x1="150"
              y1="100"
              x2="240"
              y2="200"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="rgba(255,255,255,0.18)" />
              <stop offset="1" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Prism hump (top) */}
          <path
            d="M130 55 L150 30 L230 30 L250 55 Z"
            fill="url(#topGrad)"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.5"
          />
          <rect x="158" y="38" width="64" height="12" rx="2" fill="#1d1d1f" />

          {/* Hotshoe */}
          <rect x="178" y="40" width="24" height="6" rx="1" fill="#0c0c0e" />

          {/* Main body */}
          <rect
            x="50"
            y="55"
            width="280"
            height="180"
            rx="16"
            fill="url(#bodyGrad)"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.8"
          />

          {/* Top dial */}
          <circle
            cx="295"
            cy="75"
            r="20"
            fill="#1d1d1f"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
          <circle cx="295" cy="75" r="14" fill="#272729" />
          <path
            d="M295 62 L295 88 M282 75 L308 75"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
          <circle cx="295" cy="75" r="3" fill="#6e6e73" />

          {/* Shutter button */}
          <circle cx="80" cy="75" r="9" fill="#3a3a3d" />
          <circle cx="80" cy="75" r="6" fill="#1d1d1f" />
          <circle cx="80" cy="75" r="3" fill="#0071E3" />

          {/* Mode dial */}
          <circle
            cx="120"
            cy="75"
            r="14"
            fill="#1d1d1f"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.5"
          />
          <circle cx="120" cy="75" r="9" fill="#272729" />
          <text
            x="120"
            y="79"
            textAnchor="middle"
            fontFamily="-apple-system, sans-serif"
            fontSize="7"
            fill="rgba(255,255,255,0.45)"
            fontWeight="600"
          >
            P
          </text>

          {/* Grip texture (left side) */}
          <rect x="56" y="110" width="6" height="100" rx="3" fill="rgba(255,255,255,0.04)" />
          <rect x="64" y="110" width="2" height="100" rx="1" fill="rgba(0,0,0,0.2)" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x="58"
              y={120 + i * 18}
              width="3"
              height="2"
              fill="rgba(255,255,255,0.06)"
            />
          ))}

          {/* Lens mount ring */}
          <circle
            cx="190"
            cy="150"
            r="82"
            fill="#272729"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <circle
            cx="190"
            cy="150"
            r="78"
            fill="url(#lensGrad)"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />

          {/* Lens barrel rings */}
          <circle
            cx="190"
            cy="150"
            r="72"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
          <circle
            cx="190"
            cy="150"
            r="64"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <circle
            cx="190"
            cy="150"
            r="56"
            fill="#18181a"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
          />
          <circle
            cx="190"
            cy="150"
            r="52"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />

          {/* Tick marks on lens */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const x1 = 190 + 68 * Math.cos(rad);
            const y1 = 150 + 68 * Math.sin(rad);
            const x2 = 190 + 74 * Math.cos(rad);
            const y2 = 150 + 74 * Math.sin(rad);
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />
            );
          })}

          {/* Front lens element — glass */}
          <circle cx="190" cy="150" r="44" fill="url(#glassGrad)" />
          <ellipse cx="178" cy="138" rx="18" ry="10" fill="url(#highlightGrad)" opacity="0.7" />
          <circle
            cx="190"
            cy="150"
            r="40"
            fill="none"
            stroke="rgba(0,113,227,0.3)"
            strokeWidth="0.5"
          />
          <circle
            cx="190"
            cy="150"
            r="36"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />

          {/* Inner reflection */}
          <ellipse cx="170" cy="135" rx="12" ry="6" fill="rgba(255,255,255,0.08)" />
          <circle cx="198" cy="158" r="3" fill="rgba(100,150,255,0.15)" />

          {/* Flash (left of lens) */}
          <rect
            x="70"
            y="120"
            width="40"
            height="24"
            rx="4"
            fill="#1d1d1f"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.5"
          />
          <rect x="74" y="124" width="32" height="16" rx="2" fill="rgba(255,255,255,0.04)" />
          <text
            x="90"
            y="135"
            textAnchor="middle"
            fontFamily="-apple-system, sans-serif"
            fontSize="6"
            fill="rgba(255,255,255,0.2)"
            fontWeight="600"
          >
            X
          </text>

          {/* Brand text */}
          <text
            x="190"
            y="215"
            textAnchor="middle"
            fontFamily="-apple-system, sans-serif"
            fontSize="11"
            fill="rgba(255,255,255,0.18)"
            fontWeight="600"
            letterSpacing="2"
          >
            RYOX
          </text>

          {/* Bottom plate */}
          <rect x="50" y="225" width="280" height="14" rx="8" fill="#0c0c0e" />
          <rect x="120" y="228" width="140" height="2" rx="1" fill="rgba(255,255,255,0.1)" />

          {/* Viewfinder (back hint) */}
          <rect
            x="305"
            y="115"
            width="18"
            height="14"
            rx="2"
            fill="#1d1d1f"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.5"
          />
          <rect x="307" y="117" width="14" height="10" rx="1" fill="rgba(0,113,227,0.15)" />

          {/* Strap lugs */}
          <circle
            cx="55"
            cy="65"
            r="4"
            fill="#1d1d1f"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.5"
          />
          <circle
            cx="325"
            cy="65"
            r="4"
            fill="#1d1d1f"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.5"
          />

          {/* LCD back hint (right edge) */}
          <rect
            x="295"
            y="170"
            width="30"
            height="40"
            rx="2"
            fill="#1d1d1f"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.5"
          />
          <rect x="297" y="172" width="26" height="36" rx="1" fill="rgba(0,113,227,0.08)" />
        </svg>
      </div>
    </div>
  );
}
