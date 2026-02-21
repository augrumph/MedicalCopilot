/**
 * RichAIResponse - Componente de renderização rica para respostas da IA
 * Organiza respostas médicas em formato estruturado e visualmente atraente
 */

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Lightbulb,
  Stethoscope,
  Activity,
  CheckCircle2,
  Info,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichAIResponseProps {
  content: string;
  className?: string;
}

export function RichAIResponse({ content, className }: RichAIResponseProps) {
  // Parse content into sections
  const sections = parseContentIntoSections(content);

  return (
    <div className={cn("space-y-4", className)}>
      {sections.map((section, idx) => (
        <SectionRenderer key={idx} section={section} />
      ))}
    </div>
  );
}

// Types for sections
type SectionType =
  | 'hypothesis'
  | 'red_flag'
  | 'suggestion'
  | 'diagnostic'
  | 'exam'
  | 'treatment'
  | 'general';

interface Section {
  type: SectionType;
  title: string;
  content: string;
  items?: string[];
}

// Parse markdown content into structured sections
function parseContentIntoSections(content: string): Section[] {
  const sections: Section[] = [];

  // Split by headers (###)
  const parts = content.split(/###\s+/);

  parts.forEach((part) => {
    if (!part.trim()) return;

    const lines = part.split('\n');
    const title = lines[0].trim();
    const body = lines.slice(1).join('\n').trim();

    // Detect section type from title
    const type = detectSectionType(title);

    // Extract bullet points
    const items = extractBulletPoints(body);

    sections.push({
      type,
      title: title.replace(/^\d+\.\s*/, ''), // Remove number prefix
      content: body,
      items
    });
  });

  // If no sections found, treat whole content as general
  if (sections.length === 0) {
    sections.push({
      type: 'general',
      title: 'Análise',
      content: content
    });
  }

  return sections;
}

// Detect section type from title
function detectSectionType(title: string): SectionType {
  const lower = title.toLowerCase();

  if (lower.includes('hipótese') || lower.includes('diagnóstic') || lower.includes('diferencial')) {
    return 'hypothesis';
  }
  if (lower.includes('red flag') || lower.includes('alerta') || lower.includes('sinal')) {
    return 'red_flag';
  }
  if (lower.includes('sugest') || lower.includes('recomend')) {
    return 'suggestion';
  }
  if (lower.includes('exame') || lower.includes('laboratorial')) {
    return 'exam';
  }
  if (lower.includes('tratamento') || lower.includes('conduta') || lower.includes('plano')) {
    return 'treatment';
  }

  return 'general';
}

// Extract bullet points from markdown
function extractBulletPoints(text: string): string[] {
  const items: string[] = [];
  const lines = text.split('\n');

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
      items.push(trimmed.replace(/^[\*\-]\s*/, ''));
    }
  });

  return items;
}

// Section renderer component
function SectionRenderer({ section }: { section: Section }) {
  const config = getSectionConfig(section.type);

  return (
    <Card className={cn(
      "border-2 overflow-hidden transition-all hover:shadow-lg",
      config.borderColor
    )}>
      {/* Color bar at top */}
      <div className={cn("h-1.5", config.bgColor)} />

      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2.5 rounded-xl",
            config.iconBg
          )}>
            <config.icon className={cn("w-5 h-5", config.iconColor)} />
          </div>
          <div className="flex-1">
            <CardTitle className={cn("text-base", config.textColor)}>
              {section.title}
            </CardTitle>
          </div>
          <Badge variant="outline" className={cn("font-bold text-xs", config.badgeColor)}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {section.items && section.items.length > 0 ? (
          <div className="space-y-3">
            {section.items.map((item, idx) => (
              <ItemCard key={idx} item={item} type={section.type} />
            ))}
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                strong: ({ children }) => (
                  <span className={cn("font-bold", config.highlightColor)}>
                    {children}
                  </span>
                ),
                em: ({ children }) => (
                  <span className="italic text-gray-700">{children}</span>
                ),
                p: ({ children }) => (
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    {children}
                  </p>
                ),
              }}
            >
              {section.content}
            </ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Individual item card for bullet points
function ItemCard({ item, type }: { item: string; type: SectionType }) {
  const config = getSectionConfig(type);

  // Extract title (text before first **)
  const match = item.match(/^\*\*(.+?)\*\*:?\s*/);
  const title = match ? match[1] : null;
  const description = match ? item.substring(match[0].length) : item;

  return (
    <div className={cn(
      "p-3 rounded-lg border-l-4 bg-gradient-to-r transition-all hover:shadow-md",
      config.itemBorder,
      config.itemBg
    )}>
      <div className="flex items-start gap-2">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0",
          config.dotColor
        )} />
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn("font-bold text-sm mb-1", config.textColor)}>
              {title}
            </h4>
          )}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              strong: ({ children }) => (
                <span className="font-bold text-gray-900">{children}</span>
              ),
              em: ({ children }) => (
                <span className="italic text-gray-600">{children}</span>
              ),
              p: ({ children }) => (
                <span className="text-sm text-gray-700 leading-relaxed">
                  {children}
                </span>
              ),
            }}
          >
            {description}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

// Configuration for each section type
function getSectionConfig(type: SectionType) {
  const configs = {
    hypothesis: {
      icon: Stethoscope,
      label: 'Diagnóstico',
      borderColor: 'border-purple-200',
      bgColor: 'bg-gradient-to-r from-purple-400 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-900',
      badgeColor: 'text-purple-700 border-purple-300',
      highlightColor: 'text-purple-700',
      itemBorder: 'border-purple-400',
      itemBg: 'from-purple-50 to-white',
      dotColor: 'bg-purple-500'
    },
    red_flag: {
      icon: AlertTriangle,
      label: 'Alerta',
      borderColor: 'border-red-200',
      bgColor: 'bg-gradient-to-r from-red-400 to-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-900',
      badgeColor: 'text-red-700 border-red-300',
      highlightColor: 'text-red-700',
      itemBorder: 'border-red-400',
      itemBg: 'from-red-50 to-white',
      dotColor: 'bg-red-500'
    },
    suggestion: {
      icon: Lightbulb,
      label: 'Sugestão',
      borderColor: 'border-blue-200',
      bgColor: 'bg-gradient-to-r from-blue-400 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900',
      badgeColor: 'text-blue-700 border-blue-300',
      highlightColor: 'text-blue-700',
      itemBorder: 'border-blue-400',
      itemBg: 'from-blue-50 to-white',
      dotColor: 'bg-blue-500'
    },
    exam: {
      icon: Activity,
      label: 'Exames',
      borderColor: 'border-emerald-200',
      bgColor: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-900',
      badgeColor: 'text-emerald-700 border-emerald-300',
      highlightColor: 'text-emerald-700',
      itemBorder: 'border-emerald-400',
      itemBg: 'from-emerald-50 to-white',
      dotColor: 'bg-emerald-500'
    },
    treatment: {
      icon: CheckCircle2,
      label: 'Conduta',
      borderColor: 'border-amber-200',
      bgColor: 'bg-gradient-to-r from-amber-400 to-amber-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-900',
      badgeColor: 'text-amber-700 border-amber-300',
      highlightColor: 'text-amber-700',
      itemBorder: 'border-amber-400',
      itemBg: 'from-amber-50 to-white',
      dotColor: 'bg-amber-500'
    },
    diagnostic: {
      icon: TrendingUp,
      label: 'Análise',
      borderColor: 'border-indigo-200',
      bgColor: 'bg-gradient-to-r from-indigo-400 to-indigo-600',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      textColor: 'text-indigo-900',
      badgeColor: 'text-indigo-700 border-indigo-300',
      highlightColor: 'text-indigo-700',
      itemBorder: 'border-indigo-400',
      itemBg: 'from-indigo-50 to-white',
      dotColor: 'bg-indigo-500'
    },
    general: {
      icon: Info,
      label: 'Informação',
      borderColor: 'border-gray-200',
      bgColor: 'bg-gradient-to-r from-gray-400 to-gray-600',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      textColor: 'text-gray-900',
      badgeColor: 'text-gray-700 border-gray-300',
      highlightColor: 'text-gray-700',
      itemBorder: 'border-gray-400',
      itemBg: 'from-gray-50 to-white',
      dotColor: 'bg-gray-500'
    }
  };

  return configs[type] || configs.general;
}
