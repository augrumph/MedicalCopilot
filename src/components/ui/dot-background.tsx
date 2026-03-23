/**
 * DotBackground — grade de pontos animada (inspirado MagicUI)
 * Uso: envolva a página com <DotBackground> para o efeito sutil de pontos.
 */

export function DotBackground({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #512B8118 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* radial fade over the dots */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, white 100%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
