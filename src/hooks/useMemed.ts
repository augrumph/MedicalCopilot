/**
 * useMemed Hook - REFATORADO
 * Hook para integração com MEMED Sinapse Prescrição
 *
 * Nova abordagem seguindo documentação oficial:
 * 1. Backend obtém token via API REST da MEMED
 * 2. Frontend carrega script com o token
 * 3. Frontend usa MdHub para configurar paciente e exibir prescrição
 */

import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/stores/appStore';

interface UseMemedProps {
    containerId: string;
}

interface MemedConfig {
    scriptUrl: string;
    environment: string;
}

interface DoctorToken {
    token: string;
    prescriber: {
        id: string;
        externalId: string;
        name: string;
    };
}

// Declarações globais para MEMED
declare global {
    interface Window {
        MdSinapsePrescricao: {
            event: {
                add: (eventName: string, callback: (data: any) => void) => void;
            };
        };
        MdHub: {
            command: {
                send: (module: string, command: string, data: any) => Promise<void>;
            };
            module: {
                show: (module: string) => void;
                hide: (module: string) => void;
            };
        };
    }
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export function useMemed({ containerId: _containerId }: UseMemedProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const selectedPatient = useAppStore(state => state.selectedPatient);
    const doctorName = useAppStore(state => state.doctorName);

    const scriptLoadedRef = useRef(false);
    const moduleInitializedRef = useRef(false);

    // ============================================
    // PASSO 1: Obter token do médico via backend
    // ============================================
    const [doctorToken, setDoctorToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctorToken = async () => {
            try {
                console.log('🔑 Fetching doctor token from backend...');

                // Você pode usar upsert para garantir que o médico existe
                const response = await fetch(`${BACKEND_URL}/api/memed/prescriber/upsert`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        externalId: 'doctor-default-001', // ID do médico no seu sistema
                        name: doctorName || 'Dr. Médico Exemplo',
                        cpf: '12345678900', // ⚠️ IMPORTANTE: Use CPF real do médico logado
                        professionalId: '123456', // ⚠️ IMPORTANTE: Use CRM real do médico
                        state: 'SP', // ⚠️ IMPORTANTE: Use UF real do CRM
                        specialtyId: 1, // ID da especialidade (ver MEMED_SPECIALTIES)
                        city: 'São Paulo',
                        email: 'medico@example.com',
                        phone: '11999999999',
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to get doctor token');
                }

                const data: { success: boolean; data: DoctorToken } = await response.json();

                if (data.success && data.data.token) {
                    console.log('✅ Doctor token obtained:', data.data.token.substring(0, 20) + '...');
                    setDoctorToken(data.data.token);
                } else {
                    throw new Error('Invalid response from backend');
                }
            } catch (err: any) {
                console.error('❌ Failed to fetch doctor token:', err);
                setError(`Erro ao obter token do médico: ${err.message}`);
            }
        };

        fetchDoctorToken();
    }, [doctorName]);

    // ============================================
    // PASSO 2: Carregar script MEMED com token
    // ============================================
    useEffect(() => {
        if (!doctorToken || scriptLoadedRef.current) return;

        const loadMemedScript = async () => {
            try {
                console.log('📜 Loading MEMED script...');

                // Verificar se o script já existe
                const existingScript = document.getElementById('memed-script');
                if (existingScript) {
                    existingScript.remove();
                }

                // Obter configuração do backend
                const configResponse = await fetch(`${BACKEND_URL}/api/memed/config`);
                const configData: { success: boolean; config: MemedConfig } = await configResponse.json();

                if (!configData.success) {
                    throw new Error('Failed to get MEMED config');
                }

                const scriptUrl = configData.config.scriptUrl;
                console.log('📡 Script URL:', scriptUrl);

                // Criar e carregar script
                const script = document.createElement('script');
                script.id = 'memed-script';
                script.src = scriptUrl;
                script.setAttribute('data-token', doctorToken); // ⭐ TOKEN DO MÉDICO
                script.setAttribute('data-color', '#8C00FF');
                script.async = true;

                script.onload = () => {
                    console.log('✅ MEMED script loaded successfully');
                    setIsLoaded(true);
                    scriptLoadedRef.current = true;
                };

                script.onerror = () => {
                    setError('Falha ao carregar o script da Memed.');
                };

                document.body.appendChild(script);
            } catch (err: any) {
                console.error('❌ Failed to load MEMED script:', err);
                setError(`Erro ao carregar script: ${err.message}`);
            }
        };

        loadMemedScript();
    }, [doctorToken]);

    // ============================================
    // PASSO 3: Aguardar inicialização do módulo
    // ============================================
    useEffect(() => {
        if (!isLoaded || moduleInitializedRef.current) return;

        const initializeModule = () => {
            if (!window.MdSinapsePrescricao) {
                console.warn('⚠️ MdSinapsePrescricao not available yet');
                return;
            }

            console.log('🎯 Setting up module initialization listener...');

            // Escutar evento de inicialização do módulo
            window.MdSinapsePrescricao.event.add('core:moduleInit', (module: any) => {
                if (module.name === 'plataforma.prescricao') {
                    console.log('✅ MEMED module initialized:', module);
                    moduleInitializedRef.current = true;
                    setIsInitialized(true);
                }
            });
        };

        // Tentar imediatamente ou esperar um pouco
        if (window.MdSinapsePrescricao) {
            initializeModule();
        } else {
            const timer = setTimeout(initializeModule, 1000);
            return () => clearTimeout(timer);
        }
    }, [isLoaded]);

    // ============================================
    // PASSO 4: Configurar paciente quando selecionado
    // ============================================
    useEffect(() => {
        if (!isInitialized || !selectedPatient || !window.MdHub) return;

        const configurePaciente = async () => {
            try {
                console.log('👤 Configuring patient:', selectedPatient.name);

                // Configurar dados do paciente usando MdHub
                await window.MdHub.command.send('plataforma.prescricao', 'setPaciente', {
                    idExterno: selectedPatient.id,
                    nome: selectedPatient.name,
                    cpf: '12345678900', // ⚠️ TODO: Adicionar CPF ao Patient type
                    sexo: selectedPatient.gender || 'Não informado',
                    telefone: selectedPatient.phone || '',
                    email: selectedPatient.email || '',
                    endereco: selectedPatient.address || '',
                });

                console.log('✅ Patient configured successfully');

                // Exibir módulo de prescrição
                window.MdHub.module.show('plataforma.prescricao');
            } catch (err: any) {
                console.error('❌ Failed to configure patient:', err);
                setError(`Erro ao configurar paciente: ${err.message}`);
            }
        };

        configurePaciente();
    }, [isInitialized, selectedPatient]);

    // ============================================
    // CLEANUP
    // ============================================
    useEffect(() => {
        return () => {
            // Cleanup ao desmontar
            if (window.MdHub && moduleInitializedRef.current) {
                try {
                    window.MdHub.module.hide('plataforma.prescricao');
                } catch (err) {
                    console.warn('Failed to hide MEMED module:', err);
                }
            }
        };
    }, []);

    return {
        isLoaded: isLoaded && isInitialized,
        error
    };
}
