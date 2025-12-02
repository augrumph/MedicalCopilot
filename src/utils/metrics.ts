// utils/metrics.ts
export function calculateTimeSaved(text: string): string {
  if (!text) return "0 min";
  const wordCount = text.trim().split(/\s+/).length;
  // Velocidade média médica (35ppm) + Fator de estruturação (1.5x) + Overhead fixo (1.5min)
  const minutes = (wordCount / 35) * 1.5 + 1.5;
  return minutes.toFixed(1) + " min";
}
