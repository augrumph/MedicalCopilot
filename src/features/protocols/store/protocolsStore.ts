import { create } from 'zustand';
import { toast } from 'sonner';

export type NodeType = 'START' | 'QUESTION' | 'ACTION' | 'INFO' | 'PRESCRIPTION' | 'SCORE_CALC' | 'END';

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
    condition: any | null; // e.g {"answer": "YES"}
    weight: number;
}

export interface Protocol {
    id: string;
    title: string;
    specialty: string;
    triageColor: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'BLUE';
    targetAudience: 'ADULT' | 'PEDIATRIC' | 'PREGNANT' | 'ALL';
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

interface ProtocolsState {
    protocols: Protocol[];
    activeProtocol: Protocol | null;

    // Client-Side Graph Cache
    allNodes: ProtocolNode[];
    allEdges: ProtocolEdge[];

    currentNode: ProtocolNode | null;
    currentEdges: ProtocolEdge[];
    nodeHistory: { node: ProtocolNode; edges: ProtocolEdge[] }[];

    isLoading: boolean;
    error: string | null;

    fetchProtocols: () => Promise<void>;
    startProtocol: (protocolId: string) => Promise<void>;
    moveToNextNode: (edge: ProtocolEdge) => void;
    goBack: () => void;
    resetProtocol: () => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const useProtocolsStore = create<ProtocolsState>((set, get) => ({
    protocols: [],
    activeProtocol: null,
    allNodes: [],
    allEdges: [],
    currentNode: null,
    currentEdges: [],
    nodeHistory: [],
    isLoading: false,
    error: null,

    fetchProtocols: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`${BACKEND_URL}/api/protocols`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch protocols');
            const protocols = await res.json();
            set({ protocols, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
            toast.error('Erro ao carregar os protocolos clínicos.');
        }
    },

    startProtocol: async (protocolId) => {
        set({ isLoading: true, error: null, nodeHistory: [], allNodes: [], allEdges: [] });
        try {
            const parentProtocol = get().protocols.find(p => p.id === protocolId) || null;

            const res = await fetch(`${BACKEND_URL}/api/protocols/${protocolId}/tree`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to load protocol tree');

            const { nodes, edges, startNodeId } = await res.json();

            const startNode = nodes.find((n: any) => n.id === startNodeId);
            if (!startNode) {
                throw new Error(`Nó inicial '${startNodeId}' não encontrado na árvore do protocolo.`);
            }
            const startEdges = edges.filter((e: any) => e.fromNodeId === startNodeId);

            set({
                activeProtocol: parentProtocol,
                allNodes: nodes,
                allEdges: edges,
                currentNode: startNode,
                currentEdges: startEdges,
                isLoading: false
            });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
            toast.error('Erro ao iniciar o protocolo.');
        }
    },

    moveToNextNode: (edge) => {
        const { currentNode, currentEdges, nodeHistory, allNodes, allEdges } = get();
        if (!currentNode) return;

        const nextNode = allNodes.find(n => n.id === edge.toNodeId);
        if (!nextNode) {
            toast.error('Próximo passo não encontrado na árvore.');
            return;
        }

        // Cycle detection — prevent infinite navigation loops
        const visitedIds = new Set(nodeHistory.map(h => h.node.id));
        visitedIds.add(currentNode.id);
        if (visitedIds.has(nextNode.id)) {
            console.error('[Protocol] Cycle detected: node', nextNode.id, 'already visited.');
            toast.error('Erro no protocolo: ciclo detectado. Contacte o administrador.');
            return;
        }

        const nextEdges = allEdges.filter(e => e.fromNodeId === nextNode.id);

        // Save current step to history
        const newHistory = [...nodeHistory, { node: currentNode, edges: currentEdges }];

        set({
            currentNode: nextNode,
            currentEdges: nextEdges,
            nodeHistory: newHistory
        });
    },

    goBack: () => {
        const { nodeHistory } = get();
        if (nodeHistory.length === 0) return;

        // Pop the last state
        const previousState = nodeHistory[nodeHistory.length - 1];
        const newHistory = nodeHistory.slice(0, -1);

        set({
            currentNode: previousState.node,
            currentEdges: previousState.edges,
            nodeHistory: newHistory,
        });
    },

    resetProtocol: () => {
        set({
            activeProtocol: null,
            currentNode: null,
            currentEdges: [],
            allNodes: [],
            allEdges: [],
            nodeHistory: [],
            error: null
        });
    }
}));
