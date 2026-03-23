import { describe, it, expect } from 'vitest';
import {
  filterBySearch,
  filterBySpecialty,
  filterByTriageColor,
  filterByAudience,
  highlightSearchTerm,
  sortByRelevance,
  getUniqueSpecialties,
  countByTriageColor,
  formatTags,
} from '../protocolHelpers';
import type { Protocol } from '../../types';

// ── Fixtures ─────────────────────────────────────────────────────────────────

const makeProtocol = (overrides: Partial<Protocol>): Protocol => ({
  id: 'proto-1',
  title: 'Infarto Agudo do Miocárdio',
  specialty: 'Cardiologia',
  triageColor: 'RED',
  targetAudience: 'ADULT',
  description: 'Protocolo de dor torácica isquêmica',
  tags: ['IAM', 'dor torácica', 'troponina'],
  cid10Codes: ['I21'],
  sourceGuideline: null,
  version: '1.0',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const PROTOCOLS: Protocol[] = [
  makeProtocol({ id: '1', title: 'Infarto Agudo do Miocárdio', triageColor: 'RED', specialty: 'Cardiologia', tags: ['IAM'], targetAudience: 'ADULT' }),
  makeProtocol({ id: '2', title: 'Sepse e Choque Séptico', triageColor: 'RED', specialty: 'UTI', tags: ['sepse', 'antibiótico'], targetAudience: 'ADULT' }),
  makeProtocol({ id: '3', title: 'Bronquiolite Viral Aguda', triageColor: 'YELLOW', specialty: 'Pediatria', tags: ['VRS', 'bronquiolite'], targetAudience: 'PEDIATRIC' }),
  makeProtocol({ id: '4', title: 'Crise Hipertensiva', triageColor: 'ORANGE', specialty: 'Cardiologia', tags: ['hipertensão'], targetAudience: 'ALL' }),
];

// ── filterBySearch ────────────────────────────────────────────────────────────

describe('filterBySearch', () => {
  it('returns all protocols when searchTerm is empty', () => {
    expect(filterBySearch(PROTOCOLS, '')).toHaveLength(4);
    expect(filterBySearch(PROTOCOLS, '   ')).toHaveLength(4);
  });

  it('matches on title (case-insensitive)', () => {
    const result = filterBySearch(PROTOCOLS, 'infarto');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('matches on tags', () => {
    const result = filterBySearch(PROTOCOLS, 'sepse');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('matches on description', () => {
    const result = filterBySearch(PROTOCOLS, 'dor torácica isquêmica');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns empty array when nothing matches', () => {
    expect(filterBySearch(PROTOCOLS, 'apendicite')).toHaveLength(0);
  });
});

// ── filterBySpecialty ─────────────────────────────────────────────────────────

describe('filterBySpecialty', () => {
  it('returns all when specialty is null', () => {
    expect(filterBySpecialty(PROTOCOLS, null)).toHaveLength(4);
  });

  it('filters correctly by specialty', () => {
    const result = filterBySpecialty(PROTOCOLS, 'Cardiologia');
    expect(result).toHaveLength(2);
    expect(result.every(p => p.specialty === 'Cardiologia')).toBe(true);
  });
});

// ── filterByTriageColor ───────────────────────────────────────────────────────

describe('filterByTriageColor', () => {
  it('returns all when no colors selected', () => {
    expect(filterByTriageColor(PROTOCOLS, [])).toHaveLength(4);
  });

  it('filters by single color', () => {
    const result = filterByTriageColor(PROTOCOLS, ['RED']);
    expect(result).toHaveLength(2);
    expect(result.every(p => p.triageColor === 'RED')).toBe(true);
  });

  it('filters by multiple colors', () => {
    const result = filterByTriageColor(PROTOCOLS, ['RED', 'ORANGE']);
    expect(result).toHaveLength(3);
  });
});

// ── filterByAudience ──────────────────────────────────────────────────────────

describe('filterByAudience', () => {
  it('returns all when audience is null or ALL', () => {
    expect(filterByAudience(PROTOCOLS, null)).toHaveLength(4);
    expect(filterByAudience(PROTOCOLS, 'ALL')).toHaveLength(4);
  });

  it('includes ALL-audience protocols in PEDIATRIC filter', () => {
    const result = filterByAudience(PROTOCOLS, 'PEDIATRIC');
    // id=3 (PEDIATRIC) + id=4 (ALL)
    expect(result.map(p => p.id).sort()).toEqual(['3', '4'].sort());
  });
});

// ── highlightSearchTerm ───────────────────────────────────────────────────────

describe('highlightSearchTerm', () => {
  it('returns original text when searchTerm is empty', () => {
    expect(highlightSearchTerm('hello world', '')).toBe('hello world');
    expect(highlightSearchTerm('hello world', '   ')).toBe('hello world');
  });

  it('wraps matching text in <mark>', () => {
    const result = highlightSearchTerm('Infarto Agudo', 'Infarto');
    expect(result).toContain('<mark');
    expect(result).toContain('Infarto');
    expect(result).toContain('</mark>');
  });

  it('is case-insensitive', () => {
    const result = highlightSearchTerm('INFARTO agudo', 'infarto');
    expect(result).toContain('<mark');
  });

  it('does NOT throw on ReDoS-prone input (regex special chars)', () => {
    // These would cause catastrophic backtracking without escaping
    expect(() => highlightSearchTerm('test (text) here', '(text)')).not.toThrow();
    expect(() => highlightSearchTerm('a.b.c', '.')).not.toThrow();
    expect(() => highlightSearchTerm('value+', '+')).not.toThrow();
    expect(() => highlightSearchTerm('name*', '*')).not.toThrow();
  });

  it('highlights regex-special characters literally', () => {
    const result = highlightSearchTerm('pH (7.4) value', '(7.4)');
    expect(result).toContain('(7.4)');
    expect(result).toContain('<mark');
  });
});

// ── getUniqueSpecialties ──────────────────────────────────────────────────────

describe('getUniqueSpecialties', () => {
  it('returns sorted unique specialties', () => {
    const result = getUniqueSpecialties(PROTOCOLS);
    expect(result).toEqual(['Cardiologia', 'Pediatria', 'UTI']);
    expect(result).toEqual([...result].sort());
  });
});

// ── countByTriageColor ────────────────────────────────────────────────────────

describe('countByTriageColor', () => {
  it('counts correctly', () => {
    const result = countByTriageColor(PROTOCOLS);
    expect(result.RED).toBe(2);
    expect(result.ORANGE).toBe(1);
    expect(result.YELLOW).toBe(1);
    expect(result.GREEN).toBeUndefined();
  });
});

// ── sortByRelevance ───────────────────────────────────────────────────────────

describe('sortByRelevance', () => {
  it('returns protocols unchanged when searchTerm is empty', () => {
    const result = sortByRelevance(PROTOCOLS, '');
    expect(result).toHaveLength(4);
  });

  it('ranks exact title match highest', () => {
    const protocols = [
      makeProtocol({ id: 'a', title: 'Sepse e Choque Séptico', triageColor: 'RED' }),
      makeProtocol({ id: 'b', title: 'Sepse', triageColor: 'GREEN' }),
    ];
    const result = sortByRelevance(protocols, 'sepse');
    // Both match, 'Sepse' starts with term → higher score than partial match
    expect(result[0].id).toBe('b');
  });
});

// ── formatTags ────────────────────────────────────────────────────────────────

describe('formatTags', () => {
  it('handles null tags', () => {
    expect(formatTags(null)).toEqual({ visible: [], remaining: 0 });
  });

  it('handles empty array', () => {
    expect(formatTags([])).toEqual({ visible: [], remaining: 0 });
  });

  it('returns all tags when under the limit', () => {
    const result = formatTags(['a', 'b'], 3);
    expect(result.visible).toEqual(['a', 'b']);
    expect(result.remaining).toBe(0);
  });

  it('caps visible tags and counts remaining', () => {
    const result = formatTags(['a', 'b', 'c', 'd', 'e'], 3);
    expect(result.visible).toHaveLength(3);
    expect(result.remaining).toBe(2);
  });
});
