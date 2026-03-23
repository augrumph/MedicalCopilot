/**
 * BorderBeam — borda animada com luz girando (inspirado AcernityUI)
 */

interface BorderBeamProps {
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
}

export function BorderBeam({
  duration = 4,
  colorFrom = '#512B81',
  colorTo = '#a876c4',
  borderWidth = 1.5,
}: BorderBeamProps) {
  return (
    <>
      <style>{`
        @property --border-beam-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes border-beam-spin {
          to { --border-beam-angle: 360deg; }
        }
        .border-beam-inner {
          animation: border-beam-spin ${duration}s linear infinite;
          background: conic-gradient(
            from var(--border-beam-angle, 0deg),
            transparent 0%, transparent 50%,
            ${colorFrom} 60%, ${colorTo} 75%, transparent 85%
          );
        }
      `}</style>
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div
          className="border-beam-inner absolute rounded-[inherit]"
          style={{
            inset: -borderWidth,
            WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: borderWidth,
          }}
        />
      </div>
    </>
  );
}
