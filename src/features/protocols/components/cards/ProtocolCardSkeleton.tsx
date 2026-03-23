import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export function ProtocolCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full"
    >
      <Card className="h-full backdrop-blur-sm bg-white/80 shadow-lg">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Header: Badges */}
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* Title */}
          <Skeleton className="h-7 w-full mb-2" />
          <Skeleton className="h-7 w-3/4 mb-4" />

          {/* Description */}
          <div className="space-y-2 mb-4 flex-grow">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
