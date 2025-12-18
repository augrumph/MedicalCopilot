export function DPA() {
 return (
 <div className="legal-document prose prose-sm max-w-none">
 <h2 className="text-2xl font-bold text-gray-900 mb-2">Acordo de Processamento de Dados (DPA)</h2>
 <p className="text-sm text-gray-600 mb-6">
 Este adendo regula o tratamento de dados pessoais realizado pelo MedicalCopilot em nome do Contratante.
 </p>

 <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">1. Papéis das Partes</h3>
 <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 mb-4">
 <li>
 <strong>Controlador (Você):</strong> Define a finalidade dos dados (atendimento médico) e detém a base
 legal (Tutela da Saúde).
 </li>
 <li>
 <strong>Operador (MedicalCopilot):</strong> Processa os dados seguindo as instruções do Controlador para
 fornecer a tecnologia de transcrição.
 </li>
 </ul>

 <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">2. Confidencialidade e Sigilo</h3>
 <p className="text-sm text-gray-700 mb-4">
 O MedicalCopilot compromete-se a manter estrito sigilo sobre todas as informações clínicas processadas,
 garantindo que nenhum funcionário humano tenha acesso ao conteúdo das consultas, salvo sob ordem judicial
 ou suporte técnico expresso solicitado por Você.
 </p>

 <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">3. Sub-operadores Autorizados</h3>
 <p className="text-sm text-gray-700 mb-2">
 Você autoriza o uso dos seguintes prestadores de serviço para infraestrutura:
 </p>
 <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 mb-4">
 <li>
 <strong>OpenAI LLC (EUA):</strong> Processamento de IA (Com garantia de não-treinamento).
 </li>
 <li>
 <strong>Railway / AWS (EUA):</strong> Hospedagem e Banco de Dados (Criptografados).
 </li>
 </ul>

 <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">4. Notificação de Violação</h3>
 <p className="text-sm text-gray-700 mb-4">
 No caso improvável de um vazamento de dados, o MedicalCopilot notificará o Controlador em até
 <strong> 24 horas</strong> após a descoberta do incidente.
 </p>

 <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">5. Medidas de Segurança Técnica</h3>
 <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 mb-4">
 <li>Criptografia TLS 1.2+ em todas as comunicações</li>
 <li>Criptografia AES-256 para dados em repouso</li>
 <li>Autenticação multifator disponível</li>
 <li>Logs de auditoria mantidos por 6 meses</li>
 <li>Backups criptografados com retenção de 30 dias</li>
 </ul>

 <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">6. Término do Contrato</h3>
 <p className="text-sm text-gray-700 mb-4">
 Ao término deste acordo, o MedicalCopilot compromete-se a:
 </p>
 <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 mb-4">
 <li>Deletar todos os dados pessoais em até 30 dias</li>
 <li>Fornecer exportação completa dos dados antes da exclusão</li>
 <li>Emitir certificado de destruição dos dados</li>
 </ul>

 <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">7. Transferência Internacional</h3>
 <p className="text-sm text-gray-700 mb-4">
 Os dados podem ser processados em servidores localizados nos Estados Unidos (OpenAI, AWS). Garantimos que
 tais transferências estão em conformidade com a LGPD através de cláusulas contratuais padrão e certificações
 de segurança (SOC 2, ISO 27001).
 </p>

 <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
 <p className="text-xs text-gray-600">
 <strong>Vigência:</strong> Este DPA entra em vigor a partir da sua primeira utilização do MedicalCopilot
 e permanece válido enquanto você mantiver uma conta ativa.
 </p>
 </div>
 </div>
 );
}
