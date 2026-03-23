// Re-export types from store for convenience
export type NodeType = 'START' | 'QUESTION' | 'ACTION' | 'INFO' | 'PRESCRIPTION' | 'SCORE_CALC' | 'END';

export type TriageColor = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'BLUE';

export type TargetAudience = 'ADULT' | 'PEDIATRIC' | 'PREGNANT' | 'ALL';

export interface Protocol {
  id: string;
  title: string;
  specialty: string;
  triageColor: TriageColor;
  targetAudience: TargetAudience;
  description: string | null;
  tags: string[] | null;
  cid10Codes: string[] | null;
  sourceGuideline: string | null;
  version: string;
  isActive: boolean;
  isBrazilian?: boolean;
  lastAuditDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProtocolNode {
  id: string;
  protocolId: string;
  type: NodeType;
  title: string | null;
  content: any; // Dynamic JSON payload
  uiColorHex: string | null;
  critical: boolean | null;
  createdAt: string;
}

export interface ProtocolEdge {
  id: string;
  protocolId: string;
  fromNodeId: string;
  toNodeId: string;
  condition: any | null;
  weight: number;
}

export interface History {
  nodeId: string;
  edgeId: string | null;
}

// Filter state
export interface ProtocolFilters {
  searchTerm: string;
  specialty: string | null;
  triageColors: TriageColor[];
  targetAudience: TargetAudience | null;
}
