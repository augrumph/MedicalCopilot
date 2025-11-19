import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface AudioTranscriptionPanelProps {
  isListening: boolean;
  transcript: string;
  onToggleListen: () => void;
}

export function AudioTranscriptionPanel({
  isListening,
  transcript,
  onToggleListen,
}: AudioTranscriptionPanelProps) {
  const [audioLevel, setAudioLevel] = useState(0);

  // Simula níveis de áudio quando está escutando
  useEffect(() => {
    if (!isListening) {
      setAudioLevel(0);
      return;
    }

    const interval = setInterval(() => {
      setAudioLevel(Math.random() * 100);
    }, 100);

    return () => clearInterval(interval);
  }, [isListening]);

  return (
    <Card className={cn(
      "transition-all duration-300",
      isListening && "border-primary/50 shadow-lg shadow-primary/10"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Transcrição em Tempo Real
          </span>
          {isListening && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1 items-end h-5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full transition-all duration-75"
                    style={{
                      height: `${Math.max(20, (audioLevel / 100) * 100 * (1 - i * 0.15))}%`,
                    }}
                  />
                ))}
              </div>
              <span className="text-sm text-primary font-medium animate-pulse">
                Escutando...
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={onToggleListen}
          size="lg"
          className={cn(
            "w-full h-14 text-base font-semibold transition-all duration-300",
            isListening
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-[#283618] hover:bg-[#1e2914]"
          )}
        >
          {isListening ? (
            <>
              <MicOff className="mr-2 h-5 w-5" />
              Parar de Escutar
            </>
          ) : (
            <>
              <Mic className="mr-2 h-5 w-5" />
              Começar a Escutar a Consulta
            </>
          )}
        </Button>

        {transcript && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Transcrição (visualização opcional)
            </p>
            <ScrollArea className="h-48 rounded-lg border bg-muted/50 p-4">
              <p className="text-sm whitespace-pre-wrap">{transcript}</p>
            </ScrollArea>
          </div>
        )}

        {!transcript && !isListening && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Clique no botão acima para iniciar a transcrição da consulta
          </div>
        )}
      </CardContent>
    </Card>
  );
}
