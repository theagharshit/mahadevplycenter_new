import React from 'react';

interface LogoProps {
  variant?: 'full' | 'horizontal' | 'emblem';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  lightText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
  lightText = false,
}) => {
  // Color definitions from client branding
  const darkBlue = lightText ? '#FFFFFF' : '#0B2240';
  const goldYellow = '#F2B800';
  const whiteBand = lightText ? '#0B2240' : '#FFFFFF';
  const boxBorder = lightText ? '#FFFFFF' : '#0B2240';

  let heightClass = 'h-12';
  if (size === 'sm') heightClass = 'h-9';
  if (size === 'md') heightClass = 'h-14';
  if (size === 'lg') heightClass = 'h-20';
  if (size === 'xl') heightClass = 'h-28';

  if (variant === 'emblem') {
    return (
      <svg
        viewBox="0 0 160 140"
        className={`${heightClass} ${className} w-auto inline-block`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Mahadev Ply Emblem"
      >
        {/* Dark Blue Arch Dome */}
        <path
          d="M 10,135 L 10,75 C 10,25 35,5 80,5 C 125,5 150,25 150,75 L 150,135 Z"
          fill={darkBlue}
        />

        {/* Shiva Tripundra - 3 Curved White Bands Left */}
        <path
          d="M 22,60 C 42,56 62,56 70,60 C 65,68 42,68 22,65 Z"
          fill={whiteBand}
        />
        <path
          d="M 18,80 C 42,76 62,76 68,80 C 63,88 42,88 18,85 Z"
          fill={whiteBand}
        />
        <path
          d="M 22,100 C 42,96 62,96 66,100 C 61,108 42,108 22,105 Z"
          fill={whiteBand}
        />

        {/* Shiva Tripundra - 3 Curved White Bands Right */}
        <path
          d="M 138,60 C 118,56 98,56 90,60 C 95,68 118,68 138,65 Z"
          fill={whiteBand}
        />
        <path
          d="M 142,80 C 118,76 98,76 92,80 C 97,88 118,88 142,85 Z"
          fill={whiteBand}
        />
        <path
          d="M 138,100 C 118,96 98,96 94,100 C 99,108 118,108 138,105 Z"
          fill={whiteBand}
        />

        {/* Golden Teardrop / Tilak */}
        <path
          d="M 80,40 C 60,78 60,110 80,128 C 100,110 100,78 80,40 Z"
          fill={goldYellow}
        />

        {/* Dark Blue Trishul inside Tilak */}
        <g fill={darkBlue}>
          {/* Main shaft */}
          <rect x="78.5" y="80" width="3" height="38" rx="1" />
          {/* Central prong */}
          <path d="M 80,72 L 82.5,82 L 77.5,82 Z" />
          {/* Left prong */}
          <path d="M 72,76 C 72,83 77.5,85 77.5,85 L 77.5,82 C 75,82 74.5,78 74.5,76 Z" />
          {/* Right prong */}
          <path d="M 88,76 C 88,83 82.5,85 82.5,85 L 82.5,82 C 85,82 85.5,78 85.5,76 Z" />
          {/* Damru / center ornament */}
          <path d="M 76,96 L 84,100 L 76,104 L 84,96 Z" />
        </g>
      </svg>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Emblem */}
        <svg
          viewBox="0 0 160 140"
          className={`${heightClass} w-auto shrink-0`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 10,135 L 10,75 C 10,25 35,5 80,5 C 125,5 150,25 150,75 L 150,135 Z"
            fill={darkBlue}
          />
          <path d="M 22,60 C 42,56 62,56 70,60 C 65,68 42,68 22,65 Z" fill={whiteBand} />
          <path d="M 18,80 C 42,76 62,76 68,80 C 63,88 42,88 18,85 Z" fill={whiteBand} />
          <path d="M 22,100 C 42,96 62,96 66,100 C 61,108 42,108 22,105 Z" fill={whiteBand} />

          <path d="M 138,60 C 118,56 98,56 90,60 C 95,68 118,68 138,65 Z" fill={whiteBand} />
          <path d="M 142,80 C 118,76 98,76 92,80 C 97,88 118,88 142,85 Z" fill={whiteBand} />
          <path d="M 138,100 C 118,96 98,96 94,100 C 99,108 118,108 138,105 Z" fill={whiteBand} />

          <path d="M 80,40 C 60,78 60,110 80,128 C 100,110 100,78 80,40 Z" fill={goldYellow} />

          <g fill={darkBlue}>
            <rect x="78.5" y="80" width="3" height="38" rx="1" />
            <path d="M 80,72 L 82.5,82 L 77.5,82 Z" />
            <path d="M 72,76 C 72,83 77.5,85 77.5,85 L 77.5,82 C 75,82 74.5,78 74.5,76 Z" />
            <path d="M 88,76 C 88,83 82.5,85 82.5,85 L 82.5,82 C 85,82 85.5,78 85.5,76 Z" />
            <path d="M 76,96 L 84,100 L 76,104 L 84,96 Z" />
          </g>
        </svg>

        {/* Text Stack */}
        <div className="flex flex-col">
          <div className="flex items-baseline font-black tracking-tight text-xl leading-none">
            <span style={{ color: darkBlue }}>MAHADEV</span>
            <span style={{ color: goldYellow }} className="ml-1.5">PLY</span>
            <span style={{ color: darkBlue }} className="ml-1.5">CENTER</span>
          </div>
          <span
            className="text-[10px] font-bold tracking-widest uppercase mt-1 border-t pt-0.5"
            style={{ color: darkBlue, borderColor: darkBlue }}
          >
            YOUR INTERIOR'S CHOICE
          </span>
        </div>
      </div>
    );
  }

  // Default 'full' variant - exact match to client's logo design
  return (
    <svg
      viewBox="0 0 520 240"
      className={`${heightClass} ${className} w-auto inline-block`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Mahadev Ply Center Logo"
    >
      {/* 1. Dark Blue Arch Dome Emblem */}
      <path
        d="M 190,138 L 190,75 C 190,25 215,5 260,5 C 305,5 330,25 330,75 L 330,138 Z"
        fill={darkBlue}
      />

      {/* Shiva Tripundra - 3 Curved White Bands Left */}
      <path
        d="M 202,60 C 222,56 242,56 250,60 C 245,68 222,68 202,65 Z"
        fill={whiteBand}
      />
      <path
        d="M 198,80 C 222,76 242,76 248,80 C 243,88 222,88 198,85 Z"
        fill={whiteBand}
      />
      <path
        d="M 202,100 C 222,96 242,96 246,100 C 241,108 222,108 202,105 Z"
        fill={whiteBand}
      />

      {/* Shiva Tripundra - 3 Curved White Bands Right */}
      <path
        d="M 318,60 C 298,56 278,56 270,60 C 275,68 298,68 318,65 Z"
        fill={whiteBand}
      />
      <path
        d="M 322,80 C 298,76 278,76 272,80 C 277,88 298,88 322,85 Z"
        fill={whiteBand}
      />
      <path
        d="M 318,100 C 298,96 278,96 274,100 C 279,108 298,108 318,105 Z"
        fill={whiteBand}
      />

      {/* Golden Teardrop / Tilak */}
      <path
        d="M 260,40 C 240,78 240,110 260,128 C 280,110 280,78 260,40 Z"
        fill={goldYellow}
      />

      {/* Dark Blue Trishul inside Tilak */}
      <g fill={darkBlue}>
        <rect x="258.5" y="80" width="3" height="38" rx="1" />
        <path d="M 260,72 L 262.5,82 L 257.5,82 Z" />
        <path d="M 252,76 C 252,83 257.5,85 257.5,85 L 257.5,82 C 255,82 254.5,78 254.5,76 Z" />
        <path d="M 268,76 C 268,83 262.5,85 262.5,85 L 262.5,82 C 265,82 265.5,78 265.5,76 Z" />
        <path d="M 256,96 L 264,100 L 256,104 L 264,96 Z" />
      </g>

      {/* 2. Main Box Outer Frame */}
      {/* Top Left Line */}
      <line x1="8" y1="138" x2="190" y2="138" stroke={boxBorder} strokeWidth="3.5" />
      {/* Top Right Line */}
      <line x1="330" y1="138" x2="512" y2="138" stroke={boxBorder} strokeWidth="3.5" />
      {/* Left Vertical Line */}
      <line x1="8" y1="136" x2="8" y2="188" stroke={boxBorder} strokeWidth="3.5" />
      {/* Right Vertical Line */}
      <line x1="512" y1="136" x2="512" y2="188" stroke={boxBorder} strokeWidth="3.5" />
      {/* Bottom Horizontal Line */}
      <line x1="8" y1="188" x2="512" y2="188" stroke={boxBorder} strokeWidth="3.5" />

      {/* 3. Text Inside Box: MAHADEV PLY CENTER */}
      <text
        x="24"
        y="176"
        fill={darkBlue}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="34"
        fontWeight="900"
        letterSpacing="2.5"
      >
        MAHADEV
      </text>

      <text
        x="236"
        y="176"
        fill={goldYellow}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="34"
        fontWeight="900"
        letterSpacing="2.5"
      >
        PLY
      </text>

      <text
        x="330"
        y="176"
        fill={darkBlue}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="34"
        fontWeight="900"
        letterSpacing="2.5"
      >
        CENTER
      </text>

      {/* 4. Tagline Below Box */}
      <line x1="8" y1="214" x2="108" y2="214" stroke={darkBlue} strokeWidth="2" />
      <text
        x="260"
        y="219"
        fill={darkBlue}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="16"
        fontWeight="800"
        letterSpacing="3"
        textAnchor="middle"
      >
        YOUR INTERIOR'S CHOICE
      </text>
      <line x1="412" y1="214" x2="512" y2="214" stroke={darkBlue} strokeWidth="2" />
    </svg>
  );
};
