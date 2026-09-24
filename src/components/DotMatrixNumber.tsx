import React from 'react';

// 5x7 dot matrix patterns for Nothing OS styling
// 1 = active dot, 0 = inactive dot
const MATRIX_GLYPHS: Record<string, number[][]> = {
  '0': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '1': [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  '2': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  '3': [
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
  '4': [
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
  ],
  '5': [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '6': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '7': [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
  ],
  '8': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '9': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '-': [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  '°': [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  'C': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  ':': [
    [0, 0],
    [0, 0],
    [1, 0],
    [0, 0],
    [1, 0],
    [0, 0],
    [0, 0],
  ],
};

interface DotMatrixCharProps {
  char: string;
  dotSize?: number;
  gap?: number;
  activeColor?: string;
  inactiveColor?: string;
}

export const DotMatrixChar: React.FC<DotMatrixCharProps> = ({
  char,
  dotSize = 3.5,
  gap = 2,
  activeColor = '#ffffff',
  inactiveColor = 'rgba(255, 255, 255, 0.08)',
}) => {
  const pattern = MATRIX_GLYPHS[char] || MATRIX_GLYPHS['0'];
  const rows = pattern.length;
  const cols = pattern[0]?.length || 5;

  const width = cols * dotSize + (cols - 1) * gap;
  const height = rows * dotSize + (rows - 1) * gap;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="inline-block shrink-0 align-middle"
      aria-hidden="true"
    >
      {pattern.map((row, r) =>
        row.map((val, c) => {
          const cx = c * (dotSize + gap) + dotSize / 2;
          const cy = r * (dotSize + gap) + dotSize / 2;
          const isActive = val === 1;

          return (
            <circle
              key={`${r}-${c}`}
              cx={cx}
              cy={cy}
              r={dotSize / 2}
              fill={isActive ? activeColor : inactiveColor}
              className={isActive ? 'transition-all duration-300' : ''}
            />
          );
        })
      )}
    </svg>
  );
};

interface DotMatrixStringProps {
  value: string;
  dotSize?: number;
  gap?: number;
  charSpacing?: number;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
}

export const DotMatrixString: React.FC<DotMatrixStringProps> = ({
  value,
  dotSize = 3.5,
  gap = 2,
  charSpacing = 5,
  activeColor = '#ffffff',
  inactiveColor = 'rgba(255, 255, 255, 0.08)',
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`} style={{ gap: `${charSpacing}px` }}>
      {value.split('').map((ch, idx) => (
        <DotMatrixChar
          key={idx}
          char={ch}
          dotSize={dotSize}
          gap={gap}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
        />
      ))}
    </div>
  );
};
