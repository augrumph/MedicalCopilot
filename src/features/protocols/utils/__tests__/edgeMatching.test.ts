/**
 * Tests for edge-matching logic used in QuestionNode and ScoreCalculatorNode.
 * These tests document the exact matching algorithm in isolation.
 */
import { describe, it, expect } from 'vitest';

// ── QuestionNode edge matching ────────────────────────────────────────────────

type Edge = { condition?: { answer?: string; value?: string; minScore?: number; maxScore?: number } | null };

function findQuestionEdge(edges: Edge[], value: string): Edge | undefined {
  return (
    edges.find(e => e.condition?.answer === value || e.condition?.value === value) ||
    edges.find(e => {
      // Only attempt loose match when edge has a non-empty condition value
      const cv = (e.condition?.value || '').toLowerCase();
      if (!cv) return false;
      const ov = value.toLowerCase().replace(/\s+/g, '').slice(0, 10);
      return cv.startsWith(ov) || ov.startsWith(cv);
    })
  );
}

describe('QuestionNode edge matching', () => {
  it('matches by condition.answer exact', () => {
    const edges: Edge[] = [
      { condition: { answer: 'SIM' } },
      { condition: { answer: 'NAO' } },
    ];
    expect(findQuestionEdge(edges, 'SIM')).toBe(edges[0]);
    expect(findQuestionEdge(edges, 'NAO')).toBe(edges[1]);
  });

  it('matches by condition.value exact', () => {
    const edges: Edge[] = [
      { condition: { value: 'LEVE' } },
      { condition: { value: 'GRAVE' } },
    ];
    expect(findQuestionEdge(edges, 'LEVE')).toBe(edges[0]);
    expect(findQuestionEdge(edges, 'GRAVE')).toBe(edges[1]);
  });

  it('performs loose prefix match (slug)', () => {
    const edges: Edge[] = [
      { condition: { value: 'leveamod' } },
      { condition: { value: 'grave' } },
    ];
    // "Leve a Moderada" → slug "leveamode" (10 chars)
    // edge value "leveamod" → cv="leveamod", ov="leveamode".slice(0,10) → ov starts with cv
    const result = findQuestionEdge(edges, 'Leve a Moderada');
    expect(result).toBe(edges[0]);
  });

  it('returns undefined when no edge matches (no silent fallback)', () => {
    const edges: Edge[] = [
      { condition: { answer: 'SIM' } },
    ];
    // 'NAO' does NOT match any edge — must return undefined
    const result = findQuestionEdge(edges, 'NAO');
    expect(result).toBeUndefined();
  });

  it('returns undefined for empty edges array', () => {
    expect(findQuestionEdge([], 'SIM')).toBeUndefined();
  });
});

// ── ScoreCalculatorNode edge matching ────────────────────────────────────────

function findScoreEdge(edges: Edge[], totalScore: number): Edge | undefined {
  return edges.find(e => {
    if (!e.condition) return false;
    const { minScore, maxScore } = e.condition;
    if (minScore !== undefined && maxScore !== undefined) {
      return totalScore >= minScore && totalScore <= maxScore;
    } else if (minScore !== undefined) {
      return totalScore >= minScore;
    } else if (maxScore !== undefined) {
      return totalScore <= maxScore;
    }
    return false;
  });
}

describe('ScoreCalculatorNode edge matching', () => {
  const edges: Edge[] = [
    { condition: { minScore: 0, maxScore: 2 } },  // low risk
    { condition: { minScore: 3, maxScore: 5 } },  // moderate
    { condition: { minScore: 6 } },               // high risk (open-ended)
  ];

  it('matches score in first range', () => {
    expect(findScoreEdge(edges, 0)).toBe(edges[0]);
    expect(findScoreEdge(edges, 2)).toBe(edges[0]);
  });

  it('matches score in second range', () => {
    expect(findScoreEdge(edges, 3)).toBe(edges[1]);
    expect(findScoreEdge(edges, 5)).toBe(edges[1]);
  });

  it('matches open-ended minScore range', () => {
    expect(findScoreEdge(edges, 6)).toBe(edges[2]);
    expect(findScoreEdge(edges, 100)).toBe(edges[2]);
  });

  it('returns undefined when score is between ranges (misconfigured protocol)', () => {
    const gappedEdges: Edge[] = [
      { condition: { minScore: 0, maxScore: 2 } },
      { condition: { minScore: 5, maxScore: 10 } },
    ];
    // Score 3 falls in the gap — must return undefined, not silently pick edges[0]
    expect(findScoreEdge(gappedEdges, 3)).toBeUndefined();
  });

  it('returns undefined for empty edges', () => {
    expect(findScoreEdge([], 5)).toBeUndefined();
  });

  it('returns undefined for edges with no score conditions', () => {
    const noCondEdges: Edge[] = [{ condition: null }, { condition: undefined }];
    expect(findScoreEdge(noCondEdges, 3)).toBeUndefined();
  });
});
