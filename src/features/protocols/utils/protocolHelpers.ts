import { Protocol } from '../types';

/**
 * Filtra protocolos por termo de busca
 * Busca em: título, tags, códigos CID-10, descrição
 */
export function filterBySearch(protocols: Protocol[], searchTerm: string): Protocol[] {
  if (!searchTerm.trim()) return protocols;

  const term = searchTerm.toLowerCase();

  return protocols.filter((protocol) => {
    const titleMatch = protocol.title.toLowerCase().includes(term);
    const tagsMatch = protocol.tags?.some((tag) => tag.toLowerCase().includes(term));
    const cid10Match = protocol.cid10Codes?.some((code) => code.toLowerCase().includes(term));
    const descriptionMatch = protocol.description?.toLowerCase().includes(term);

    return titleMatch || tagsMatch || cid10Match || descriptionMatch;
  });
}

/**
 * Filtra protocolos por especialidade
 */
export function filterBySpecialty(protocols: Protocol[], specialty: string | null): Protocol[] {
  if (!specialty) return protocols;
  return protocols.filter((p) => p.specialty === specialty);
}

/**
 * Filtra protocolos por cor de triagem
 */
export function filterByTriageColor(
  protocols: Protocol[],
  colors: string[]
): Protocol[] {
  if (colors.length === 0) return protocols;
  return protocols.filter((p) => colors.includes(p.triageColor));
}

/**
 * Filtra protocolos por público-alvo
 */
export function filterByAudience(
  protocols: Protocol[],
  audience: string | null
): Protocol[] {
  if (!audience || audience === 'ALL') return protocols;
  return protocols.filter((p) => p.targetAudience === audience || p.targetAudience === 'ALL');
}

/**
 * Obtém lista única de especialidades
 */
export function getUniqueSpecialties(protocols: Protocol[]): string[] {
  const specialties = protocols.map((p) => p.specialty);
  return Array.from(new Set(specialties)).sort();
}

/**
 * Conta protocolos por cor de triagem
 */
export function countByTriageColor(protocols: Protocol[]): Record<string, number> {
  return protocols.reduce((acc, protocol) => {
    acc[protocol.triageColor] = (acc[protocol.triageColor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Obtém protocolos de emergência (RED/ORANGE)
 */
export function getEmergencyProtocols(protocols: Protocol[]): Protocol[] {
  return protocols
    .filter((p) => p.triageColor === 'RED' || p.triageColor === 'ORANGE')
    .sort((a, b) => {
      // RED primeiro, depois ORANGE
      if (a.triageColor === 'RED' && b.triageColor === 'ORANGE') return -1;
      if (a.triageColor === 'ORANGE' && b.triageColor === 'RED') return 1;
      return a.title.localeCompare(b.title);
    });
}

/**
 * Retorna informações de tempo-alvo por cor de triagem (Manchester)
 */
export function getTriageInfo(color: string): {
  label: string;
  targetMinutes: number;
  description: string;
  urgency: 'critical' | 'high' | 'moderate' | 'low' | 'non-urgent';
} {
  const info = {
    RED: {
      label: 'Emergência',
      targetMinutes: 0,
      description: 'Atendimento imediato - risco de vida',
      urgency: 'critical' as const,
    },
    ORANGE: {
      label: 'Muito Urgente',
      targetMinutes: 10,
      description: 'Atendimento em até 10 minutos',
      urgency: 'high' as const,
    },
    YELLOW: {
      label: 'Urgente',
      targetMinutes: 60,
      description: 'Atendimento em até 60 minutos',
      urgency: 'moderate' as const,
    },
    GREEN: {
      label: 'Pouco Urgente',
      targetMinutes: 120,
      description: 'Atendimento em até 2 horas',
      urgency: 'low' as const,
    },
    BLUE: {
      label: 'Não Urgente',
      targetMinutes: 240,
      description: 'Atendimento em até 4 horas',
      urgency: 'non-urgent' as const,
    },
  };

  return info[color as keyof typeof info] || info.BLUE;
}

/**
 * Destaca termos de busca em um texto
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text;

  // Escape special regex characters to prevent ReDoS
  const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900">$1</mark>');
}

/**
 * Formata lista de tags para exibição (limita quantidade)
 */
export function formatTags(tags: string[] | null, maxTags: number = 3): {
  visible: string[];
  remaining: number;
} {
  if (!tags || tags.length === 0) {
    return { visible: [], remaining: 0 };
  }

  const visible = tags.slice(0, maxTags);
  const remaining = Math.max(0, tags.length - maxTags);

  return { visible, remaining };
}

/**
 * Ordena protocolos por relevância (útil para resultados de busca)
 */
export function sortByRelevance(
  protocols: Protocol[],
  searchTerm: string
): Protocol[] {
  if (!searchTerm.trim()) return protocols;

  const term = searchTerm.toLowerCase();

  return [...protocols].sort((a, b) => {
    // Prioridade: título exato > título parcial > tags > CID-10 > descrição
    const aScore = calculateRelevanceScore(a, term);
    const bScore = calculateRelevanceScore(b, term);

    return bScore - aScore;
  });
}

function calculateRelevanceScore(protocol: Protocol, term: string): number {
  let score = 0;

  const title = protocol.title.toLowerCase();
  if (title === term) score += 100;
  else if (title.startsWith(term)) score += 50;
  else if (title.includes(term)) score += 25;

  if (protocol.tags?.some((tag) => tag.toLowerCase() === term)) score += 40;
  else if (protocol.tags?.some((tag) => tag.toLowerCase().includes(term))) score += 20;

  if (protocol.cid10Codes?.some((code) => code.toLowerCase().includes(term))) score += 15;

  if (protocol.description?.toLowerCase().includes(term)) score += 10;

  // Boost para protocolos críticos
  if (protocol.triageColor === 'RED') score += 5;
  if (protocol.triageColor === 'ORANGE') score += 3;

  return score;
}
