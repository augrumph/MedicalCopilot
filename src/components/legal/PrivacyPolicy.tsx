export function PrivacyPolicy() {
 return (
 <div className="legal-document prose prose-sm max-w-none">
 <h2 className="text-2xl font-bold text-gray-900 mb-2">Política de Privacidade - MedicalCopilot</h2>
 <p className="text-sm text-gray-600 mb-6"><strong>Última atualização:</strong> Novembro 2025</p>

 <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">1. Introdução</h3>
 <p className="text-sm text-gray-700 mb-4">
 O MedicalCopilot ("Nós") atua como <strong>Operador de Dados</strong> sob a Lei Geral de Proteção de Dados
 (LGPD - Lei 13.709/2018). Esta política descreve como processamos dados em nome do Profissional de Saúde
 ("Você" ou"Controlador").
 </p>

 <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">2. Dados que Coletamos</h3>
 <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 mb-4">
 <li>
 <strong>Dados da Conta:</strong> Nome, CRM, e-mail e especialidade (para gestão da sua assinatura).
 </li>
 <li>
 <strong>Dados de Saúde (Pacientes):</strong> Áudio das consultas e transcrições. Estes dados pertencem
 a Você e são processados estritamente para gerar as notas clínicas.
 </li>
 </ul>

 <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">3. Uso de Inteligência Artificial</h3>
 <p className="text-sm text-gray-700 mb-2">
 Utilizamos a API da OpenAI (Enterprise/Platform) para processamento. Garantimos que:
 </p>
 <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 mb-4">
 <li>
 <strong>Zero Treinamento:</strong> Seus dados e os de seus pacientes <strong>NÃO</strong> são utilizados
 para treinar os modelos públicos da OpenAI (ChatGPT).
 </li>
 <li>
 <strong>Retenção Mínima:</strong> Os dados enviados à IA são descartados após o processamento.
 </li>
 </ul>

 <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">4. Armazenamento e Exclusão</h3>
 <p className="text-sm text-gray-700 mb-4">
 O áudio original é excluído automaticamente conforme sua configuração (recomendamos exclusão imediata).
 As transcrições são armazenadas criptografadas até que você solicite a exclusão ou cancele sua conta.
 </p>

 <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">5. Segurança</h3>
 <p className="text-sm text-gray-700 mb-4">
 Utilizamos criptografia TLS 1.2+ em trânsito e AES-256 em repouso. O acesso à conta é protegido por
 autenticação segura.
 </p>

 <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">6. Seus Direitos</h3>
 <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 mb-4">
 <li>Confirmação de existência de tratamento</li>
 <li>Acesso aos dados</li>
 <li>Correção de dados incompletos ou desatualizados</li>
 <li>Anonimização, bloqueio ou eliminação</li>
 <li>Portabilidade dos dados</li>
 <li>Revogação do consentimento</li>
 </ul>

 <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">7. Contato</h3>
 <p className="text-sm text-gray-700 mb-4">
 Para exercer seus direitos ou esclarecer dúvidas, entre em contato através de:
 <strong> privacy@medicalcopilot.com.br</strong>
 </p>
 </div>
 );
}
