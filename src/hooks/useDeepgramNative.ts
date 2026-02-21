/**
 * useDeepgramNative - Native WebSocket implementation
 * Solves HTTP/2 incompatibility issue with Deepgram SDK
 */

import { useState, useRef, useCallback, useEffect } from 'react';

const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;

interface UseDeepgramNativeProps {
    onTranscript: (transcript: string, isFinal: boolean, speakerId?: number, confidence?: number) => void;
}

export function useDeepgramNative({ onTranscript }: UseDeepgramNativeProps) {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const isConnectingRef = useRef(false);

    const connect = useCallback(async () => {
        if (isConnectingRef.current || wsRef.current) return;

        if (!DEEPGRAM_API_KEY) {
            setError('Deepgram API Key não configurada');
            console.error('❌ DEEPGRAM_API_KEY not configured');
            return;
        }

        try {
            isConnectingRef.current = true;
            console.log('🎙️ Connecting to Deepgram (Native WebSocket)...');

            // Build WebSocket URL with parameters - NO encoding/sample_rate for webm
            const params = new URLSearchParams({
                model: 'nova-3',
                language: 'pt-BR',
                smart_format: 'true',
                punctuate: 'true',
                interim_results: 'true',
                utterances: 'true', // Group words into utterances
                // Diarization removed - focusing on AI insights instead
                // Don't specify encoding/sample_rate - let Deepgram auto-detect from webm
            });

            const wsUrl = `wss://api.deepgram.com/v1/listen?${params.toString()}`;

            // Create WebSocket with auth via subprotocol
            const ws = new WebSocket(wsUrl, ['token', DEEPGRAM_API_KEY]);
            wsRef.current = ws;

            ws.onopen = async () => {
                console.log('✅ Deepgram WebSocket connection established');
                setError(null);

                // Get microphone access
                console.log('🎤 Requesting microphone access...');
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true,
                            sampleRate: 48000, // Browser default
                        }
                    });

                    console.log('✅ Microphone access granted');
                    streamRef.current = stream;

                    // Create MediaRecorder with webm/opus (browser native)
                    const mediaRecorder = new MediaRecorder(stream, {
                        mimeType: 'audio/webm;codecs=opus',
                    });
                    mediaRecorderRef.current = mediaRecorder;

                    // Send audio data to Deepgram
                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
                            console.log(`🎵 Sending audio chunk: ${event.data.size} bytes`);
                            ws.send(event.data);
                        }
                    };

                    // Start recording (send chunks every 100ms for lower latency)
                    mediaRecorder.start(100);
                    setIsListening(true);
                    console.log('🚀 Deepgram transcription started');

                } catch (micError: any) {
                    console.error('❌ Microphone error:', micError);
                    setError(`Erro ao acessar microfone: ${micError.message}`);
                }
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    // Log ALL messages from Deepgram for debugging
                    console.log('📨 Deepgram message received:', data);

                    // Handle error messages from Deepgram
                    if (data.error) {
                        console.error('❌ Deepgram API error:', data.error);
                        setError(`Erro Deepgram: ${data.error}`);
                        return;
                    }

                    // Handle transcription results
                    if (data.channel?.alternatives?.[0]?.transcript) {
                        const transcript = data.channel.alternatives[0].transcript;
                        const isFinal = data.is_final || false;
                        const confidence = data.channel.alternatives[0].confidence;

                        console.log('📝 Deepgram transcript:', { transcript, isFinal, confidence });

                        if (transcript && transcript.trim()) {
                            onTranscript(transcript, isFinal, undefined, confidence);
                        }
                    } else if (data.type === 'Results') {
                        // Empty result (no speech detected in this segment)
                        console.log('⚪ Empty transcript result (no speech detected)');
                    }
                } catch (parseError) {
                    console.error('❌ Error parsing Deepgram response:', parseError);
                }
            };

            ws.onerror = (event) => {
                console.error('❌ Deepgram WebSocket error:', event);
                setError('Erro de conexão WebSocket');
            };

            ws.onclose = (event) => {
                console.log('🔌 Deepgram connection closed:', {
                    code: event.code,
                    reason: event.reason || 'No reason provided',
                    wasClean: event.wasClean
                });

                // Log common close codes
                if (event.code === 1000) {
                    console.log('✅ Normal closure');
                } else if (event.code === 1006) {
                    console.warn('⚠️ Abnormal closure - connection lost');
                } else if (event.code === 4001) {
                    console.error('❌ Authentication failed - check API key');
                } else if (event.code === 4002) {
                    console.error('❌ Insufficient credits');
                } else if (event.code !== 1005) {
                    console.warn(`⚠️ Unusual close code: ${event.code}`);
                }

                setIsListening(false);
            };

        } catch (err: any) {
            console.error('❌ Failed to connect to Deepgram:', err);
            setError(err.message);
        } finally {
            isConnectingRef.current = false;
        }
    }, [onTranscript]);

    const disconnect = useCallback(() => {
        console.log('🔌 Disconnecting from Deepgram...');
        console.trace('Disconnect trace:');

        // Stop media recorder
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

        // Stop media stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        // Close WebSocket
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.close();
        }

        wsRef.current = null;
        mediaRecorderRef.current = null;
        setIsListening(false);

        console.log('✅ Disconnected successfully');
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        connect,
        disconnect,
        isListening,
        error,
    };
}
