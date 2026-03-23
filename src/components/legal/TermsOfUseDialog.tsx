import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

export function TermsOfUseDialog() {
  const [open, setOpen] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(true);
  const { user, acceptTerms } = useAppStore();

  useEffect(() => {
    if (user) {
      // Verifica se o campo acceptedTermsAt existe no objeto user vindo do backend
      if (!user.acceptedTermsAt) {
        setHasAccepted(false);
        setOpen(true);
      } else {
        setHasAccepted(true);
        setOpen(false);
      }
    }
  }, [user]);

  const handleAccept = async () => {
    if (user) {
      await acceptTerms();
      setHasAccepted(true);
      setOpen(false);
    }
  };

  if (hasAccepted || !user) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => {
      // Don't allow closing without accepting
      if (hasAccepted) setOpen(open);
    }}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-[#1b1b1b]">
              Termos de Uso e Responsabilidade Clínica
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-500">
            Aviso importante sobre o uso da plataforma MedicalCopilot em ambiente clínico.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-6 text-sm text-slate-600 leading-relaxed">
          <div className="space-y-6">
            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">1. Natureza da Plataforma (Software de Apoio)</h3>
              <p>
                O MedicalCopilot é uma ferramenta de <strong>suporte à decisão clínica e documentação</strong>, baseada em inteligência artificial e protocolos oficiais vigentes. <strong>A plataforma NÃO substitui o julgamento clínico, o diagnóstico médico ou a prescrição profissional.</strong>
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">2. Responsabilidade Profissional Exclusiva</h3>
              <p>
                A responsabilidade final por qualquer diagnóstico, conduta, prescrição ou procedimento recai <strong>exclusivamente sobre o médico assistente</strong>. Ao utilizar a plataforma, você concorda que:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>As sugestões da IA e os protocolos exibidos são referenciais e educacionais.</li>
                <li>Você deve revisar e validar de forma independente todas as informações (incluindo CID-10, dosagens medicamentosas e condutas) geradas pelo sistema antes de aplicá-las ao paciente.</li>
                <li>Você assume total responsabilidade por erros ou omissões resultantes da aceitação acrítica das sugestões do sistema.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">3. Privacidade e LGPD (Proteção de Dados)</h3>
              <p>
                Na qualidade de Controlador de Dados (ou preposto do hospital), você é responsável por garantir o consentimento do paciente ao utilizar recursos de gravação de áudio (transcrição). O MedicalCopilot atua como Operador de Dados e aplica criptografia, não retendo áudios além do estritamente necessário para a geração do prontuário, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">4. Atualização de Protocolos</h3>
              <p>
                Embora envidemos esforços contínuos para manter nossa base de conhecimento atualizada com as diretrizes do Ministério da Saúde, CFM, e sociedades médicas brasileiras (ex: SBC, SBP), a medicina é uma ciência em constante evolução. O Médico deve sempre se guiar pelas melhores e mais recentes evidências científicas disponíveis.
              </p>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t border-slate-100 bg-slate-50 flex-col sm:flex-row gap-3">
          <div className="flex-1 text-xs text-slate-500 flex items-center gap-2">
            Ao clicar em aceitar, você concorda legalmente com estes termos, vinculando-os ao seu CRM.
          </div>
          <Button 
            onClick={handleAccept}
            className="bg-[#512B81] hover:bg-[#412268] text-white font-bold px-8 h-11 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Eu Compreendo e Aceito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
