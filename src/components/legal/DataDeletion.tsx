import { AlertTriangle, Trash2, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DataDeletionProps {
  onSelectPatient?: () => void;
  onDeleteAccount?: () => void;
  doctorName?: string;
}

export function DataDeletion({ onSelectPatient, onDeleteAccount, doctorName = 'Dr. Silva' }: DataDeletionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Solicitação de Direito ao Esquecimento (Art. 18 LGPD)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Você está prestes a exercer o direito de exclusão de dados.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700">
          <strong>Atenção:</strong> A exclusão de dados é uma ação irreversível. Certifique-se de exportar
          qualquer informação necessária antes de prosseguir.
        </p>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mt-6">Opções Disponíveis:</h3>

      {/* Opção 1: Excluir dados de um paciente */}
      <Card className="border-gray-300 hover:border-purple-300 transition-all">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <UserX className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-base font-bold text-gray-900 mb-2">
                1. Excluir dados de um Paciente Específico
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Remove todo histórico, notas clínicas e logs vinculados a um CPF/Nome específico.
                Esta opção é útil quando um paciente solicita a exclusão de seus dados.
              </p>
              <Button
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
                onClick={onSelectPatient}
              >
                <UserX className="mr-2 h-4 w-4" />
                Selecionar Paciente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opção 2: Excluir conta completa */}
      <Card className="border-2 border-red-300 hover:border-red-400 transition-all">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-base font-bold text-red-600 mb-2">
                2. Excluir Minha Conta ({doctorName})
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Remove todos os seus dados pessoais, todos os pacientes cadastrados e todo o histórico de consultas.
              </p>
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                <p className="text-xs text-red-700 font-medium">
                  ⚠️ <strong>Esta ação é IRREVERSÍVEL.</strong> Após a confirmação, você terá 30 dias para exportar
                  seus dados antes da exclusão permanente.
                </p>
              </div>
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
                onClick={onDeleteAccount}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Solicitar Encerramento de Conta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nota de rodapé legal */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
        <p className="text-xs text-gray-600">
          <strong>Nota Legal:</strong> Logs de segurança (histórico de acessos e tentativas de login) podem ser
          mantidos por até 6 meses após a exclusão da conta, conforme exigido pelo Marco Civil da Internet
          (Lei 12.965/2014, Art. 15). Estes logs contêm apenas dados técnicos (IP, data/hora) e não incluem
          informações clínicas.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-gray-700">
          <strong>Precisa de ajuda?</strong> Entre em contato com nosso suporte em
          <strong> privacy@medicalcopilot.com.br</strong> para esclarecer dúvidas sobre o processo de exclusão.
        </p>
      </div>
    </div>
  );
}
