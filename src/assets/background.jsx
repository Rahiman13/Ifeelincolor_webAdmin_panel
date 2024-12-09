import React from 'react';

const Background = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff9a9e" />
          <stop offset="100%" stopColor="#fad0c4" />
        </linearGradient>
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#55efc4" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#55efc4" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Background glow */}
      <circle cx="500" cy="500" r="450" fill="url(#glowGradient)" />
      
      {/* Human body */}
      <path
        d="M500 150 L450 300 L400 550 L450 800 L500 850 L550 800 L600 550 L550 300 Z"
        fill="url(#bodyGradient)"
      />
      
      {/* Head */}
      <circle cx="500" cy="150" r="70" fill="url(#bodyGradient)" />
      
      {/* Arms */}
      <path d="M450 300 Q350 400 300 550" stroke="url(#bodyGradient)" strokeWidth="40" fill="none" />
      <path d="M550 300 Q650 400 700 550" stroke="url(#bodyGradient)" strokeWidth="40" fill="none" />
      
      {/* Legs */}
      <path d="M450 800 Q400 900 350 950" stroke="url(#bodyGradient)" strokeWidth="40" fill="none" />
      <path d="M550 800 Q600 900 650 950" stroke="url(#bodyGradient)" strokeWidth="40" fill="none" />
      
      {/* Brain representation */}
      <ellipse cx="500" cy="130" rx="50" ry="40" fill="#81ecec" opacity="0.7" />
      
      {/* Emotion centers */}
      <circle cx="480" cy="120" r="15" fill="#ff7675" />
      <circle cx="520" cy="120" r="15" fill="#74b9ff" />
      
      {/* Recovery path */}
      <path
        d="M300 500 Q500 300 700 500 Q500 700 300 500"
        fill="none"
        stroke="#55efc4"
        strokeWidth="10"
        strokeDasharray="20,10"
      />
    </svg>
  );
};

export default Background;