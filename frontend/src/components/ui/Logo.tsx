import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 ${className}`}
    >
      {/* Gradients para sa Enterprise at Modernong dating */}
      <defs>
        <linearGradient id="logoGradient" x1="10" y1="100" x2="90" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" /> {/* Indigo 600 */}
          <stop offset="50%" stopColor="#6366f1" /> {/* Indigo 500 */}
          <stop offset="100%" stopColor="#a855f7" /> {/* Purple 500 */}
        </linearGradient>
      </defs>

      {/* 1. Ang Daang Pataas (Walk - Discipleship) */}
      <path
        d="M50 90V48"
        stroke="url(#logoGradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Ang mga Sanga (Work - Disciplemaking / Multiplication) */}
      <path
        d="M25 25C25 45 42 48 50 48C58 48 75 45 75 25"
        stroke="url(#logoGradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Ang Sentral na Krus/Gabay (Jesus as the Center) */}
      <path
        d="M32 48H68"
        stroke="url(#logoGradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}