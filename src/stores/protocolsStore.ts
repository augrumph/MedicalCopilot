/**
 * Canonical re-export from the features store.
 * All consumers of @/stores/protocolsStore get the single source of truth.
 */
export {
    useProtocolsStore,
    type NodeType,
    type ProtocolNode,
    type ProtocolEdge,
    type Protocol,
} from '@/features/protocols/store/protocolsStore';
