import {
  PlayCircle,
  HelpCircle,
  Activity,
  Info,
  Pill,
  Calculator,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import { NodeType } from '../types';

/**
 * Mapa de ícones por tipo de node
 */
export const nodeTypeIcons: Record<NodeType, LucideIcon> = {
  START: PlayCircle,
  QUESTION: HelpCircle,
  ACTION: Activity,
  INFO: Info,
  PRESCRIPTION: Pill,
  SCORE_CALC: Calculator,
  END: CheckCircle2,
};

/**
 * Mapa de cores por tipo de node
 */
export const nodeTypeColors: Record<NodeType, string> = {
  START: '#8C00FF', // Purple
  QUESTION: '#F59E0B', // Amber
  ACTION: '#1E293B', // Navy
  INFO: '#6B7280', // Gray
  PRESCRIPTION: '#EC4899', // Pink
  SCORE_CALC: '#8C00FF', // Purple
  END: '#10B981', // Green
};

/**
 * Retorna o ícone para um tipo de node
 */
export function getNodeIcon(nodeType: NodeType): LucideIcon {
  return nodeTypeIcons[nodeType] || Info;
}

/**
 * Retorna a cor para um tipo de node
 */
export function getNodeColor(nodeType: NodeType): string {
  return nodeTypeColors[nodeType] || '#6B7280';
}

/**
 * Retorna label amigável para tipo de node
 */
export function getNodeTypeLabel(nodeType: NodeType): string {
  const labels: Record<NodeType, string> = {
    START: 'Início',
    QUESTION: 'Pergunta',
    ACTION: 'Ação',
    INFO: 'Informação',
    PRESCRIPTION: 'Prescrição',
    SCORE_CALC: 'Calculadora',
    END: 'Conclusão',
  };

  return labels[nodeType] || nodeType;
}
