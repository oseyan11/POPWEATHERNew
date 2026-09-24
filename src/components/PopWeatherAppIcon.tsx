import React from 'react';

interface PopWeatherAppIconProps {
  className?: string;
  size?: number | string;
}

export const PopWeatherAppIcon: React.FC<PopWeatherAppIconProps> = ({
  className = '',
  size = 48,
}) => {
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="pwi-benday-blue" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="3.2" fill="#0066d6" />
        </pattern>
        <pattern id="pwi-benday-sun" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="2.8" fill="#FF7B00" />
        </pattern>
        <pattern id="pwi-benday-cloud" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="2.8" fill="#58B8FF" opacity="0.65" />
        </pattern>
        <pattern id="pwi-benday-text" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.5" fill="#E6A800" opacity="0.6" />
        </pattern>
        <clipPath id="pwi-squircle">
          <rect x="0" y="0" width="512" height="512" rx="112" ry="112" />
        </clipPath>
      </defs>

      <g clipPath="url(#pwi-squircle)">
        {/* Base App Icon Cyan-Blue Sky */}
        <rect width="512" height="512" fill="#0080FF" />
        {/* Halftone dots overlay */}
        <rect width="512" height="512" fill="url(#pwi-benday-blue)" />

        {/* ================= SUN GROUP ================= */}
        <g transform="translate(245, 175)">
          {/* Ray 1 */}
          <polygon points="0,-165 24,-105 -24,-105" fill="#FFCA00" stroke="#000000" strokeWidth="12" strokeLinejoin="round" />
          {/* Ray 2 */}
          <polygon points="85,-140 75,-80 35,-110" fill="#FFB300" stroke="#000000" strokeWidth="12" strokeLinejoin="round" />
          {/* Ray 3 */}
          <polygon points="145,-75 110,-35 80,-75" fill="#FFCA00" stroke="#000000" strokeWidth="12" strokeLinejoin="round" />
          {/* Ray 4 */}
          <polygon points="165,0 105,24 105,-24" fill="#FFB300" stroke="#000000" strokeWidth="12" strokeLinejoin="round" />
          {/* Ray 5 */}
          <polygon points="140,85 80,75 110,35" fill="#FFCA00" stroke="#000000" strokeWidth="12" strokeLinejoin="round" />
          {/* Ray 6 */}
          <polygon points="-85,-140 -35,-110 -75,-80" fill="#FFB300" stroke="#000000" strokeWidth="12" strokeLinejoin="round" />
          {/* Ray 7 */}
          <polygon points="-145,-75 -80,-75 -110,-35" fill="#FFCA00" stroke="#000000" strokeWidth="12" strokeLinejoin="round" />
          {/* Ray 8 */}
          <polygon points="-165,0 -105,-24 -105,24" fill="#FFCA00" stroke="#000000" strokeWidth="12" strokeLinejoin="round" />
          {/* Ray 9 */}
          <polygon points="-140,85 -110,35 -80,75" fill="#FFB300" stroke="#000000" strokeWidth="12" strokeLinejoin="round" />

          {/* Sun Main Body Circle */}
          <circle cx="0" cy="0" r="108" fill="#FFE800" stroke="#000000" strokeWidth="14" />
          <path d="M 0,-108 A 108 108 0 0 1 108,0 A 108 108 0 0 1 0,108 Z" fill="url(#pwi-benday-sun)" opacity="0.65" />
          <path d="M -70,-35 A 80 80 0 0 1 20,-80" fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
          <circle cx="-50" cy="-60" r="7" fill="#FFFFFF" />
        </g>

        {/* ================= CLOUD GROUP ================= */}
        <g>
          <path
            d="M 125,320 C 70,320 35,275 45,225 C 50,175 100,150 145,170 C 170,125 240,110 290,135 C 335,115 410,135 435,190 C 485,215 495,280 460,335 C 435,375 380,390 330,380 C 285,405 210,400 165,375 C 135,375 125,350 125,320 Z"
            fill="#000000"
            transform="translate(10, 10)"
          />
          <path
            d="M 125,320 C 70,320 35,275 45,225 C 50,175 100,150 145,170 C 170,125 240,110 290,135 C 335,115 410,135 435,190 C 485,215 495,280 460,335 C 435,375 380,390 330,380 C 285,405 210,400 165,375 C 135,375 125,350 125,320 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="15"
            strokeLinejoin="round"
          />
          <path
            d="M 280,145 C 330,125 405,145 430,195 C 475,220 485,280 450,330 C 430,365 375,380 330,370 C 285,395 210,390 165,365 C 210,330 250,250 280,145 Z"
            fill="url(#pwi-benday-cloud)"
          />
          <path d="M 105,200 C 130,175 160,185 180,205" fill="none" stroke="#000000" strokeWidth="8" strokeLinecap="round" />
          <path d="M 390,175 C 415,195 425,230 420,260" fill="none" stroke="#000000" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* ================= 3 RAINDROPS ================= */}
        <g transform="translate(0, 10)">
          <g transform="translate(225, 410) rotate(15)">
            <path d="M 0,-40 C 18,-15 22,15 0,35 C -22,15 -18,-15 0,-40 Z" fill="#000000" transform="translate(6, 6)" />
            <path d="M 0,-40 C 18,-15 22,15 0,35 C -22,15 -18,-15 0,-40 Z" fill="#0099FF" stroke="#000000" strokeWidth="9" />
            <ellipse cx="-5" cy="5" rx="4" ry="12" fill="#FFFFFF" transform="rotate(-15 -5 5)" />
          </g>
          <g transform="translate(315, 400) rotate(15)">
            <path d="M 0,-40 C 18,-15 22,15 0,35 C -22,15 -18,-15 0,-40 Z" fill="#000000" transform="translate(6, 6)" />
            <path d="M 0,-40 C 18,-15 22,15 0,35 C -22,15 -18,-15 0,-40 Z" fill="#0099FF" stroke="#000000" strokeWidth="9" />
            <ellipse cx="-5" cy="5" rx="4" ry="12" fill="#FFFFFF" transform="rotate(-15 -5 5)" />
          </g>
          <g transform="translate(395, 380) rotate(15)">
            <path d="M 0,-35 C 16,-12 20,12 0,30 C -20,12 -16,-12 0,-35 Z" fill="#000000" transform="translate(5, 5)" />
            <path d="M 0,-35 C 16,-12 20,12 0,30 C -20,12 -16,-12 0,-35 Z" fill="#0099FF" stroke="#000000" strokeWidth="8" />
            <ellipse cx="-4" cy="4" rx="3.5" ry="10" fill="#FFFFFF" transform="rotate(-15 -4 4)" />
          </g>
        </g>

        {/* ================= POP WEATHER TYPOGRAPHY ================= */}
        <g transform="translate(240, 265) rotate(-9)">
          <text
            x="0"
            y="22"
            textAnchor="middle"
            fontFamily="'Titan One', 'Bangers', Impact, sans-serif"
            fontSize="152"
            fontWeight="900"
            fill="#000000"
            stroke="#000000"
            strokeWidth="32"
            strokeLinejoin="round"
            letterSpacing="2"
          >
            POP
          </text>
          <text
            x="-6"
            y="10"
            textAnchor="middle"
            fontFamily="'Titan One', 'Bangers', Impact, sans-serif"
            fontSize="152"
            fontWeight="900"
            fill="#FFFCE8"
            stroke="#000000"
            strokeWidth="16"
            strokeLinejoin="round"
            letterSpacing="2"
          >
            POP
          </text>
          <text
            x="-6"
            y="10"
            textAnchor="middle"
            fontFamily="'Titan One', 'Bangers', Impact, sans-serif"
            fontSize="152"
            fontWeight="900"
            fill="url(#pwi-benday-text)"
            letterSpacing="2"
          >
            POP
          </text>

          <g transform="translate(0, 78) rotate(4)">
            <rect x="-175" y="-38" width="350" height="66" rx="14" fill="#000000" transform="translate(6, 6)" />
            <rect x="-175" y="-38" width="350" height="66" rx="14" fill="#000000" stroke="#FFE800" strokeWidth="5" />
            <text
              x="0"
              y="9"
              textAnchor="middle"
              fontFamily="'Bangers', 'Titan One', Impact, sans-serif"
              fontSize="52"
              fontWeight="900"
              letterSpacing="4"
              fill="#FFFCE8"
            >
              WEATHER
            </text>
          </g>
        </g>

        <path
          d="M 450,90 L 458,110 L 478,118 L 458,126 L 450,146 L 442,126 L 422,118 L 442,110 Z"
          fill="#FFE800"
          stroke="#000000"
          strokeWidth="4"
        />
      </g>

      <rect x="0" y="0" width="512" height="512" rx="112" ry="112" fill="none" stroke="#000000" strokeWidth="18" />
    </svg>
  );
};
