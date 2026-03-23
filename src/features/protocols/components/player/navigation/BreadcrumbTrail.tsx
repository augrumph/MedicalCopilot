import { CheckCircle2 } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { motion } from 'framer-motion';
import { ProtocolNode } from '../../../types';
import { getNodeIcon, getNodeTypeLabel } from '../../../utils/nodeTypeIcons';

interface BreadcrumbTrailProps {
  history: ProtocolNode[];
  currentNode: ProtocolNode;
}

export function BreadcrumbTrail({ history, currentNode }: BreadcrumbTrailProps) {
  const allNodes = [...history, currentNode];

  if (allNodes.length <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200"
    >
      <Breadcrumb>
        <BreadcrumbList className="flex-wrap">
          {allNodes.map((node, index) => {
            const Icon = getNodeIcon(node.type);
            const isLast = index === allNodes.length - 1;
            const isCurrent = node.id === currentNode.id;

            return (
              <div key={node.id} className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className={`
                      flex items-center gap-2 text-xs font-medium
                      ${isCurrent ? 'text-purple-600 font-black' : 'text-gray-600'}
                    `}
                  >
                    {isCurrent ? (
                      <Icon className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                    <span className="max-w-[100px] truncate">
                      {node.title || getNodeTypeLabel(node.type)}
                    </span>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {!isLast && <BreadcrumbSeparator />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </motion.div>
  );
}
