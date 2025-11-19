import type { Patient, Consultation } from './types';

// 10 Pacientes mockados para psicologia
export const psychologyPatients: Patient[] = [
  {
    id: 'psy-1',
    name: 'Ana Carolina Silva',
    age: 28,
    gender: 'Feminino',
    mainConditions: ['Transtorno de Ansiedade Social'],
    notes: 'Demanda principal: ansiedade em situações sociais, principalmente no trabalho. Início há 2 anos. Boa adesão ao tratamento.'
  },
  {
    id: 'psy-2',
    name: 'Rafael Oliveira',
    age: 35,
    gender: 'Masculino',
    mainConditions: ['Transtorno Depressivo Maior'],
    notes: 'Episódio depressivo moderado. Histórico de 3 episódios anteriores. Em uso de medicação psiquiátrica.'
  },
  {
    id: 'psy-3',
    name: 'Mariana Costa',
    age: 42,
    gender: 'Feminino',
    mainConditions: ['Transtorno de Ansiedade Generalizada'],
    notes: 'Preocupação excessiva sobre diversos aspectos da vida. Sintomas físicos frequentes (tensão muscular, insônia).'
  },
  {
    id: 'psy-4',
    name: 'Pedro Santos',
    age: 22,
    gender: 'Masculino',
    mainConditions: ['Transtorno de Pânico'],
    notes: 'Ataques de pânico recorrentes. Evitação de locais públicos. Primeira vez em terapia.'
  },
  {
    id: 'psy-5',
    name: 'Juliana Ferreira',
    age: 31,
    gender: 'Feminino',
    mainConditions: ['Transtorno Obsessivo-Compulsivo'],
    notes: 'Obsessões relacionadas à limpeza e organização. Compulsões de verificação. Prejuízo significativo na rotina.'
  },
  {
    id: 'psy-6',
    name: 'Carlos Eduardo',
    age: 45,
    gender: 'Masculino',
    mainConditions: ['Burnout Profissional'],
    notes: 'Exaustão emocional relacionada ao trabalho. Dificuldade em estabelecer limites. Insônia e irritabilidade.'
  },
  {
    id: 'psy-7',
    name: 'Beatriz Almeida',
    age: 19,
    gender: 'Feminino',
    mainConditions: ['Transtorno Alimentar (AN)'],
    notes: 'Anorexia nervosa tipo restritivo. Acompanhamento multidisciplinar (psiquiatria, nutrição). Risco moderado.'
  },
  {
    id: 'psy-8',
    name: 'Lucas Mendes',
    age: 27,
    gender: 'Masculino',
    mainConditions: ['TDAH (Adulto)'],
    notes: 'Dificuldade de concentração, impulsividade e desorganização. Impacto na vida profissional e relacionamentos.'
  },
  {
    id: 'psy-9',
    name: 'Fernanda Rocha',
    age: 38,
    gender: 'Feminino',
    mainConditions: ['Luto Complicado'],
    notes: 'Perda do cônjuge há 8 meses. Dificuldade de aceitação, isolamento social, sintomas depressivos.'
  },
  {
    id: 'psy-10',
    name: 'Gabriel Lima',
    age: 24,
    gender: 'Masculino',
    mainConditions: ['Fobia Social Específica'],
    notes: 'Medo intenso de falar em público. Evitação de apresentações acadêmicas. Prejuízo na carreira.'
  }
];

// Sessões mockadas para psicologia
export const psychologySessions: Consultation[] = [
  // Ana Carolina Silva - 3 sessões
  {
    id: 'session-1',
    patientId: 'psy-1',
    startedAt: new Date('2025-11-15T14:00:00').toISOString(),
    finishedAt: new Date('2025-11-15T14:50:00').toISOString(),
    transcript: 'Paciente relatou ansiedade intensa em reunião de trabalho esta semana...',
    doctorNotes: 'Sessão 8: Paciente apresentou evolução no registro de pensamentos automáticos. Conseguiu identificar 5 pensamentos distorcidos durante a semana. Relatou ansiedade intensa (8/10) em reunião com chefe. Praticou técnica de respiração com sucesso em 2 ocasiões. Não conseguiu realizar exposição planejada (conversa com colega).\n\nIntervenções: Reestruturação cognitiva dos pensamentos sobre julgamento. Reforço das técnicas de respiração. Psicoeducação sobre ciclo da evitação.\n\nTarefas: Continuar registro diário. Exposição gradual: iniciar conversa breve com 1 colega. Praticar mindfulness 10min/dia.',
    aiSuggestions: {
      diagnosesMostLikely: ['Transtorno de Ansiedade Social (TAS)'],
      diagnosesToConsider: ['Transtorno de Ansiedade Generalizada'],
      diagnosesUnlikely: []
    }
  },
  {
    id: 'session-2',
    patientId: 'psy-1',
    startedAt: new Date('2025-11-08T14:00:00').toISOString(),
    finishedAt: new Date('2025-11-08T14:50:00').toISOString(),
    transcript: 'Revisão de tarefas da semana...',
    doctorNotes: 'Sessão 7: Paciente trouxe registro de pensamentos automáticos (4 situações). Demonstrou boa compreensão das distorções cognitivas. Relatou dificuldade em realizar exposição devido a "semana corrida".\n\nIntervenções: Identificação de esquiva sutil. Discussão sobre a importância da exposição gradual.',
    aiSuggestions: {
      diagnosesMostLikely: ['Transtorno de Ansiedade Social (TAS)'],
      diagnosesToConsider: [],
      diagnosesUnlikely: []
    }
  },
  {
    id: 'session-3',
    patientId: 'psy-1',
    startedAt: new Date('2025-10-25T14:00:00').toISOString(),
    finishedAt: new Date('2025-10-25T14:50:00').toISOString(),
    transcript: 'Primeira sessão de terapia...',
    doctorNotes: 'Sessão 1 (Avaliação): Paciente 28a, solteira, trabalha como analista financeira. Queixa principal: ansiedade intensa em situações sociais, principalmente no ambiente de trabalho. Sintomas há aproximadamente 2 anos, com piora nos últimos 6 meses.\n\nHistória: Sempre foi "tímida", mas conseguia lidar bem. Após promoção, passou a ter mais exposição em reuniões e apresentações. Desenvolveu medo intenso de julgamento negativo.\n\nSintomas: Taquicardia, sudorese, tremores, pensamentos de "vou fazer papel de idiota". Evitação de reuniões, almoços com colegas.\n\nFuncionamento: Prejuízo moderado no trabalho e relacionamentos. Sem ideação suicida. Sono e apetite preservados.',
    aiSuggestions: {
      diagnosesMostLikely: ['Transtorno de Ansiedade Social (TAS)'],
      diagnosesToConsider: ['Fobia Específica', 'Transtorno de Personalidade Evitativa'],
      diagnosesUnlikely: []
    }
  },

  // Rafael Oliveira - 2 sessões
  {
    id: 'session-4',
    patientId: 'psy-2',
    startedAt: new Date('2025-11-18T10:00:00').toISOString(),
    finishedAt: new Date('2025-11-18T10:50:00').toISOString(),
    transcript: 'Paciente relatou melhora significativa do humor...',
    doctorNotes: 'Sessão 12: Paciente apresentou melhora significativa do humor nas últimas 2 semanas. Retomou atividades de lazer (caminhada 3x/semana). Relatou ainda dificuldade em atividades que antes geravam prazer, mas com menor intensidade.\n\nMedicação: Sertralina 100mg mantida, sem efeitos colaterais. Boa adesão.\n\nIntervenções: Ativação comportamental - reforço das atividades realizadas. Reestruturação de crenças sobre "não merecer se sentir bem".\n\nTarefas: Agendar 2 atividades prazerosas na semana. Continuar registro de humor diário.',
    aiSuggestions: {
      diagnosesMostLikely: ['Transtorno Depressivo Maior - Episódio em remissão parcial'],
      diagnosesToConsider: [],
      diagnosesUnlikely: []
    }
  },
  {
    id: 'session-5',
    patientId: 'psy-2',
    startedAt: new Date('2025-11-11T10:00:00').toISOString(),
    finishedAt: new Date('2025-11-11T10:50:00').toISOString(),
    transcript: 'Discussão sobre sintomas depressivos...',
    doctorNotes: 'Sessão 11: Humor ainda rebaixado, mas paciente conseguiu realizar 2 das 3 atividades programadas (ir ao mercado e visitar irmã). Relatou anedonia persistente, mas nota pequena melhora.\n\nSono: melhora com ajuste medicamentoso (agora dorme 6h/noite vs 3-4h anteriormente).\n\nPensamentos: Menos ruminação sobre "ser um fracasso". Conseguiu questionar alguns pensamentos automáticos negativos.',
    aiSuggestions: {
      diagnosesMostLikely: ['Transtorno Depressivo Maior - Episódio moderado'],
      diagnosesToConsider: [],
      diagnosesUnlikely: []
    }
  },

  // Mariana Costa - 2 sessões
  {
    id: 'session-6',
    patientId: 'psy-3',
    startedAt: new Date('2025-11-17T16:00:00').toISOString(),
    finishedAt: new Date('2025-11-17T16:50:00').toISOString(),
    transcript: 'Paciente trouxe lista de preocupações...',
    doctorNotes: 'Sessão 6: Paciente elaborou lista de preocupações conforme solicitado. Identificou 12 preocupações ativas, sendo 8 sobre futuro distante (>6 meses). Reconheceu padrão de "preocupação com a preocupação".\n\nTensão muscular: Relatou melhora com técnica de relaxamento muscular progressivo (praticou 4x na semana).\n\nIntervenções: Técnica de "tempo de preocupação" (15min diários). Questionamento socrático sobre preocupações catastróficas.\n\nTarefas: Praticar "tempo de preocupação". Registro de evidências contra preocupações.',
    aiSuggestions: {
      diagnosesMostLikely: ['Transtorno de Ansiedade Generalizada'],
      diagnosesToConsider: [],
      diagnosesUnlikely: []
    }
  },
  {
    id: 'session-7',
    patientId: 'psy-3',
    startedAt: new Date('2025-11-10T16:00:00').toISOString(),
    finishedAt: new Date('2025-11-10T16:50:00').toISOString(),
    transcript: 'Revisão de sintomas ansiosos...',
    doctorNotes: 'Sessão 5: Paciente relatou semana "muito ansiosa". Preocupações sobre saúde da mãe, finanças e trabalho. Dificuldade de concentração (6/10). Insônia de manutenção (acorda 2-3x/noite).\n\nReconheceu que preocupações são excessivas, mas "não consigo parar de pensar".\n\nIntervenções: Psicoeducação sobre TAG. Introdução de técnica de relaxamento muscular progressivo.',
    aiSuggestions: {
      diagnosesMostLikely: ['Transtorno de Ansiedade Generalizada'],
      diagnosesToConsider: [],
      diagnosesUnlikely: []
    }
  },

  // Pedro Santos - 1 sessão
  {
    id: 'session-8',
    patientId: 'psy-4',
    startedAt: new Date('2025-11-16T09:00:00').toISOString(),
    finishedAt: new Date('2025-11-16T09:50:00').toISOString(),
    transcript: 'Primeira sessão - avaliação inicial...',
    doctorNotes: 'Sessão 1 (Avaliação): Paciente 22a, estudante universitário. Primeiro ataque de pânico há 3 meses (durante aula). Desde então, teve mais 5 episódios. Desenvolveu medo de ter novos ataques.\n\nSintomas durante ataque: Taquicardia, falta de ar, tontura, medo de morrer ou "ficar louco" (duração: 10-15min).\n\nComportamento: Evita lugares fechados, transporte público, aglomerações. Faltou 8 aulas no último mês.\n\nFuncionamento: Prejuízo acadêmico significativo. Isolamento social crescente.\n\nPlano: TCC para transtorno de pânico. Psicoeducação sobre ataques de pânico. Avaliar necessidade de encaminhamento psiquiátrico.',
    aiSuggestions: {
      diagnosesMostLikely: ['Transtorno de Pânico'],
      diagnosesToConsider: ['Agorafobia'],
      diagnosesUnlikely: []
    }
  },

  // Juliana Ferreira - 2 sessões
  {
    id: 'session-9',
    patientId: 'psy-5',
    startedAt: new Date('2025-11-14T15:00:00').toISOString(),
    finishedAt: new Date('2025-11-14T15:50:00').toISOString(),
    transcript: 'Discussão sobre exposição com prevenção de resposta...',
    doctorNotes: 'Sessão 10: Paciente relatou sucesso parcial na EPR (Exposição e Prevenção de Resposta). Conseguiu adiar ritual de verificação em 3 ocasiões, mas cedeu em outras 2. Ansiedade inicial 9/10, após 20min sem ritual: 6/10.\n\nObsessões: Continua pensamentos intrusivos sobre contaminação (frequência: 15-20x/dia, antes era 40x/dia).\n\nIntervenções: Reforço positivo dos sucessos. Discussão sobre tolerância à ansiedade. Hierarquia de EPR revista.\n\nTarefas: EPR diária (situações de nível 4 da hierarquia). Registro de ansiedade.',
    aiSuggestions: {
      diagnosesMostLikely: ['Transtorno Obsessivo-Compulsivo'],
      diagnosesToConsider: [],
      diagnosesUnlikely: []
    }
  },
  {
    id: 'session-10',
    patientId: 'psy-5',
    startedAt: new Date('2025-11-07T15:00:00').toISOString(),
    finishedAt: new Date('2025-11-07T15:50:00').toISOString(),
    transcript: 'Introdução à técnica de EPR...',
    doctorNotes: 'Sessão 9: Introdução formal à técnica de Exposição e Prevenção de Resposta (EPR). Paciente demonstrou boa compreensão do racional. Criada hierarquia de situações (10 níveis, de 1-10).\n\nPaciente aceitou iniciar EPR com nível 3: "Tocar maçaneta sem lavar mãos imediatamente".\n\nPreocupações da paciente: Medo de que a ansiedade "nunca diminua".',
    aiSuggestions: {
      diagnosesMostLikely: ['Transtorno Obsessivo-Compulsivo'],
      diagnosesToConsider: [],
      diagnosesUnlikely: []
    }
  },

  // Carlos Eduardo - 1 sessão
  {
    id: 'session-11',
    patientId: 'psy-6',
    startedAt: new Date('2025-11-19T11:00:00').toISOString(),
    finishedAt: new Date('2025-11-19T11:50:00').toISOString(),
    transcript: 'Paciente relatou exaustão severa...',
    doctorNotes: 'Sessão 4: Paciente relatou semana extremamente desgastante. Trabalhou até tarde 4 noites (saiu 22h). Não conseguiu dizer "não" para demandas extras do chefe.\n\nSintomas: Exaustão (10/10), irritabilidade, insônia, dores de cabeça frequentes. Sentimento de "não dar conta".\n\nIntervenções: Treino de assertividade iniciado. Role-play de situação de dizer "não" ao chefe. Discussão sobre crenças limitantes ("se eu negar, vão me demitir").\n\nTarefas: Dizer "não" a pelo menos 1 demanda não urgente. Reservar 30min/dia para atividade prazerosa.',
    aiSuggestions: {
      diagnosesMostLikely: ['Burnout Profissional', 'Transtorno de Adaptação'],
      diagnosesToConsider: ['Transtorno Depressivo'],
      diagnosesUnlikely: []
    }
  },

  // Beatriz Almeida - 1 sessão (caso sensível)
  {
    id: 'session-12',
    patientId: 'psy-7',
    startedAt: new Date('2025-11-13T14:00:00').toISOString(),
    finishedAt: new Date('2025-11-13T14:50:00').toISOString(),
    transcript: 'Acompanhamento semanal...',
    doctorNotes: 'Sessão 15: Paciente apresentou ganho de 0,5kg na última semana (peso atual: 48kg, altura: 1,65m, IMC: 17,6). Continua resistência alimentar, mas seguindo plano nutricional com maior adesão.\n\nDistorção de imagem corporal: Ainda presente, mas paciente consegue questionar alguns pensamentos. Medo intenso de ganhar peso persiste.\n\nAcompanhamento multidisciplinar: Psiquiatria ajustou fluoxetina. Nutricionista reporta evolução lenta mas consistente.\n\nIntervenções: Reestruturação cognitiva sobre peso e imagem. Reforço positivo por seguir plano alimentar.\n\nALERTA: Monitorar sinais de risco. Próxima sessão: reavaliar necessidade de internação (critério: se peso < 47kg).',
    aiSuggestions: {
      diagnosesMostLikely: ['Anorexia Nervosa - Tipo Restritivo'],
      diagnosesToConsider: [],
      diagnosesUnlikely: []
    }
  },

  // Lucas Mendes - 1 sessão
  {
    id: 'session-13',
    patientId: 'psy-8',
    startedAt: new Date('2025-11-12T13:00:00').toISOString(),
    finishedAt: new Date('2025-11-12T13:50:00').toISOString(),
    transcript: 'Discussão sobre estratégias de organização...',
    doctorNotes: 'Sessão 7: Paciente relatou melhora significativa com uso de metilfenidato (iniciado há 3 semanas). Consegue focar melhor no trabalho (antes: 20min, agora: 60-90min).\n\nOrganização: Implementou sistema de lembretes no celular. Conseguiu cumprir 70% das tarefas programadas (grande evolução).\n\nImpulsividade: Ainda presente em situações sociais. Relatou "falar sem pensar" e interromper colegas em reuniões.\n\nIntervenções: Psicoeducação sobre TDAH adulto. Estratégias de organização (chunks de tempo, listas). Técnicas para controle de impulsividade verbal.\n\nTarefas: Continuar sistema de lembretes. Praticar "pausa de 3 segundos" antes de falar.',
    aiSuggestions: {
      diagnosesMostLikely: ['TDAH - Tipo Combinado (Adulto)'],
      diagnosesToConsider: [],
      diagnosesUnlikely: []
    }
  },

  // Fernanda Rocha - 1 sessão
  {
    id: 'session-14',
    patientId: 'psy-9',
    startedAt: new Date('2025-11-18T16:00:00').toISOString(),
    finishedAt: new Date('2025-11-18T16:50:00').toISOString(),
    transcript: 'Sessão focada no processo de luto...',
    doctorNotes: 'Sessão 6: Paciente trouxe álbum de fotos do falecido esposo (tarefa da sessão anterior). Conseguiu falar sobre memórias positivas com menos choro (progresso significativo).\n\nAceitação: Paciente verbaliza compreensão de que "ele não vai voltar", mas ainda há momentos de negação ("acordo e espero que ele esteja lá").\n\nIsolamento social: Aceitou convite de amiga para almoço (primeira saída social em 8 meses). Relatou sentimento de culpa por "estar se divertindo".\n\nIntervenções: Validação do processo de luto. Normalização da culpa. Discussão sobre "continuar vivendo não significa esquecer".\n\nTarefas: Realizar 1 atividade social na semana. Escrever carta de despedida ao esposo.',
    aiSuggestions: {
      diagnosesMostLikely: ['Luto Complicado', 'Transtorno de Luto Prolongado'],
      diagnosesToConsider: ['Transtorno Depressivo Maior'],
      diagnosesUnlikely: []
    }
  },

  // Gabriel Lima - 1 sessão
  {
    id: 'session-15',
    patientId: 'psy-10',
    startedAt: new Date('2025-11-15T10:00:00').toISOString(),
    finishedAt: new Date('2025-11-15T10:50:00').toISOString(),
    transcript: 'Preparação para apresentação acadêmica...',
    doctorNotes: 'Sessão 5: Paciente tem apresentação de TCC em 2 semanas. Ansiedade antecipatória intensa (9/10). Pensamentos catastróficos: "vou travar", "vão rir de mim", "vou reprovar".\n\nExposição gradual: Praticou apresentação sozinho em casa (3x). Conseguiu apresentar para amigo próximo com ansiedade 7/10.\n\nIntervenções: Reestruturação cognitiva dos pensamentos catastróficos. Técnicas de ancoragem. Planejamento de exposição gradual (próximos passos: apresentar para grupo de 3 pessoas).\n\nTarefas: Praticar apresentação diariamente. Exposição: apresentar para grupo de estudo (3 pessoas). Técnica de respiração antes de dormir.',
    aiSuggestions: {
      diagnosesMostLikely: ['Fobia Social Específica (Falar em Público)'],
      diagnosesToConsider: ['Transtorno de Ansiedade Social'],
      diagnosesUnlikely: []
    }
  }
];
