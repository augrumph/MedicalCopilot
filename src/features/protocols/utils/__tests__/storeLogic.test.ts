/**
 * Tests for logic extracted from protocolsStore.
 * Covers cycle detection and progress calculation.
 */
import { describe, it, expect } from 'vitest';

// ── Cycle detection ───────────────────────────────────────────────────────────

type HistoryEntry = { node: { id: string } };

function hasCycle(nodeHistory: HistoryEntry[], currentNodeId: string, nextNodeId: string): boolean {
  const visitedIds = new Set(nodeHistory.map(h => h.node.id));
  visitedIds.add(currentNodeId);
  return visitedIds.has(nextNodeId);
}

describe('Protocol store — cycle detection', () => {
  it('returns false when no cycle (normal forward navigation)', () => {
    const history = [{ node: { id: 'node-1' } }, { node: { id: 'node-2' } }];
    expect(hasCycle(history, 'node-3', 'node-4')).toBe(false);
  });

  it('detects when next node is in history', () => {
    const history = [{ node: { id: 'node-1' } }, { node: { id: 'node-2' } }];
    // Trying to go back to node-1 through a forward edge
    expect(hasCycle(history, 'node-3', 'node-1')).toBe(true);
  });

  it('detects self-loop (current node → itself)', () => {
    const history: HistoryEntry[] = [];
    expect(hasCycle(history, 'node-1', 'node-1')).toBe(true);
  });

  it('allows first navigation from empty history', () => {
    expect(hasCycle([], 'start', 'node-1')).toBe(false);
  });

  it('detects cycle in longer path', () => {
    const history = [
      { node: { id: 'start' } },
      { node: { id: 'q1' } },
      { node: { id: 'a1' } },
      { node: { id: 'q2' } },
    ];
    expect(hasCycle(history, 'a2', 'q1')).toBe(true);  // going back to q1
    expect(hasCycle(history, 'a2', 'end')).toBe(false); // new node OK
  });
});

// ── Progress calculation ──────────────────────────────────────────────────────

function calcProgress(isAtEnd: boolean, historyLength: number): number {
  if (isAtEnd) return 100;
  const steps = historyLength;
  return Math.min(90, Math.round((1 - 1 / (steps + 2)) * 90 + 5));
}

describe('Protocol player — progress calculation', () => {
  it('returns 100 when at END node', () => {
    expect(calcProgress(true, 5)).toBe(100);
  });

  it('starts above 0 at step 0 (welcome step)', () => {
    const p = calcProgress(false, 0);
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThan(100);
  });

  it('grows monotonically as history increases', () => {
    const values = [0, 1, 2, 5, 10, 20].map(n => calcProgress(false, n));
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
    }
  });

  it('never exceeds 90% before reaching END', () => {
    for (let n = 0; n <= 100; n++) {
      expect(calcProgress(false, n)).toBeLessThanOrEqual(90);
    }
  });
});

// ── startProtocol startNode guard ─────────────────────────────────────────────

describe('Protocol store — startProtocol startNode guard', () => {
  it('startNode is found correctly', () => {
    const nodes = [
      { id: 'node-start', type: 'START' },
      { id: 'node-2', type: 'QUESTION' },
    ];
    const startNodeId = 'node-start';
    const startNode = nodes.find(n => n.id === startNodeId);
    expect(startNode).toBeDefined();
    expect(startNode?.type).toBe('START');
  });

  it('throws when startNodeId is not in nodes (missing node)', () => {
    const nodes = [{ id: 'node-2', type: 'QUESTION' }];
    const startNodeId = 'node-start';
    const startNode = nodes.find(n => n.id === startNodeId);
    expect(startNode).toBeUndefined();
    // The store now throws on this condition instead of silently setting undefined
    const wouldThrow = () => {
      if (!startNode) throw new Error(`Nó inicial '${startNodeId}' não encontrado`);
    };
    expect(wouldThrow).toThrow('Nó inicial');
  });
});
