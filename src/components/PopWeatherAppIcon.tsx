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
        <pattern id="pwi-dot-blue" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="4.2" fill="#0066E6" />
        </pattern>
        <pattern id="pwi-dot-sun" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="4.2" fill="#FF9E00" />
        </pattern>
        <clipPath id="pwi-squircle">
          <rect x="0" y="0" width="512" height="512" rx="108" ry="108" />
        </clipPath>
      </defs>

      <g clipPath="url(#pwi-squircle)">
        <rect width="512" height="512" fill="#0080FF" />
        <rect width="512" height="512" fill="url(#pwi-dot-blue)" />
        <circle cx="256" cy="256" r="196" fill="#FFD800" />
        <circle cx="256" cy="256" r="196" fill="url(#pwi-dot-sun)" />
      </g>

      <rect x="0" y="0" width="512" height="512" rx="108" ry="108" fill="none" stroke="#000000" strokeWidth="16" />
    </svg>
  );
};
