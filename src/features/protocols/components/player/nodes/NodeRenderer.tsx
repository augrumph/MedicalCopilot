import { ProtocolNode, ProtocolEdge } from '../../../types';
import { StartNode } from './StartNode';
import { QuestionNode } from './QuestionNode';
import { ActionNode } from './ActionNode';
import { InfoNode } from './InfoNode';
import { PrescriptionNode } from './PrescriptionNode';
import { ScoreCalculatorNode } from './ScoreCalculatorNode';
import { EndNode } from './EndNode';
import { motion, AnimatePresence } from 'framer-motion';
import { nodeTransition } from '@/lib/animations/protocol-animations';
import { AlertTriangle } from 'lucide-react';

const KNOWN_TYPES = ['START', 'QUESTION', 'ACTION', 'INFO', 'PRESCRIPTION', 'SCORE_CALC', 'END'];

interface NodeRendererProps {
  node: ProtocolNode;
  edges: ProtocolEdge[];
  onSelectEdge: (edge: ProtocolEdge) => void;
  onFinish?: () => void;
}

export function NodeRenderer({ node, edges, onSelectEdge, onFinish }: NodeRendererProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={node.id}
        variants={nodeTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {node.type === 'START' && (
          <StartNode node={node} edges={edges} onSelectEdge={onSelectEdge} />
        )}
        {node.type === 'QUESTION' && (
          <QuestionNode node={node} edges={edges} onSelectEdge={onSelectEdge} />
        )}
        {node.type === 'ACTION' && (
          <ActionNode node={node} edges={edges} onSelectEdge={onSelectEdge} />
        )}
        {node.type === 'INFO' && (
          <InfoNode node={node} edges={edges} onSelectEdge={onSelectEdge} />
        )}
        {node.type === 'PRESCRIPTION' && (
          <PrescriptionNode node={node} edges={edges} onSelectEdge={onSelectEdge} />
        )}
        {node.type === 'SCORE_CALC' && (
          <ScoreCalculatorNode node={node} edges={edges} onSelectEdge={onSelectEdge} />
        )}
        {node.type === 'END' && (
          <EndNode node={node} onFinish={onFinish} />
        )}
        {!KNOWN_TYPES.includes(node.type) && (
          <div className="max-w-3xl mx-auto w-full text-center py-16">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-slate-700 font-semibold">Tipo de nó desconhecido: <code>{node.type}</code></p>
            <p className="text-slate-400 text-sm mt-1">Contacte o administrador do sistema.</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
