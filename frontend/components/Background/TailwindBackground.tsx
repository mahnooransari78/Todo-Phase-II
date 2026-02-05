// components/Background/TailwindBackground.tsx
import React from 'react';

const TailwindBackground = () => {
  return (
    <>
      {/* Smoke / glass background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent backdrop-blur-3xl" />

      {/* Subtle noise / fog layer */}
      <div className="fixed inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_40%)]" />
    </>
  );
};

export default TailwindBackground;
