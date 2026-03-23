import { BookOpen, TrendingUp, Shield, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { fadeInScale, listContainer, listItem } from '@/lib/animations/protocol-animations';

interface ProtocolsHeroProps {
  totalProtocols: number;
  emergencyCount: number;
}

export function ProtocolsHero({ totalProtocols, emergencyCount }: ProtocolsHeroProps) {
  const stats = [
    {
      icon: BookOpen,
      value: totalProtocols,
      label: 'Protocolos',
      color: 'text-purple-600',
    },
    {
      icon: Shield,
      value: emergencyCount,
      label: 'Emergências',
      color: 'text-red-600',
    },
    {
      icon: TrendingUp,
      label: 'Atualizados',
      color: 'text-green-600',
      badge: '2026',
    },
    {
      icon: Zap,
      label: 'Baseados em Evidências',
      color: 'text-amber-600',
      badge: '100%',
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInScale}
      className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl"
    >
      {/* Background pattern (opcional) */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
            Protocolos Clínicos
          </Badge>

          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
            Protocolos Baseados em Evidências
          </h1>

          <p className="text-xl md:text-2xl text-purple-100 font-medium max-w-3xl">
            Acesse protocolos clínicos atualizados e validados, seguindo as melhores práticas
            médicas para tomada de decisão rápida e precisa.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={listItem}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
              >
                <Icon className={`h-6 w-6 ${stat.color} mb-2`} />
                <div className="flex items-baseline gap-2">
                  {stat.value !== undefined ? (
                    <p className="text-3xl font-black">{stat.value}</p>
                  ) : stat.badge ? (
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      {stat.badge}
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm text-purple-100 font-medium mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
