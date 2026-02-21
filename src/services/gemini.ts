
// Read Gemini API Key from environment variable
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Using Gemini 3 Flash as per official documentation
const MODEL_NAME = 'gemini-3-flash-preview';

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

interface GeminiMessage {
    role: 'user' | 'model';
    parts: { text?: string; inline_data?: { mime_type: string; data: string } }[];
}

interface CallGeminiOptions {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
}

export async function callGemini(
    messages: any[],
    options: CallGeminiOptions = {}
): Promise<string> {
    const {
        systemPrompt,
        temperature = 0.1, // Even more conservative for medical accuracy
        maxTokens = 2048,
        jsonMode = false
    } = options;

    // 1. Converte mensagens para formato Gemini
    const contents: GeminiMessage[] = [];
    let systemInstruction: any = undefined;

    if (systemPrompt) {
        systemInstruction = {
            parts: [{ text: systemPrompt }]
        };
    }

    // Se messages for apenas o array de conteúdo do user (estilo do hook antigo)
    // Normaliza para [{ role: 'user', content: ... }]
    const normalizedMessages = Array.isArray(messages) && !messages[0].role
        ? [{ role: 'user', content: messages }]
        : messages;

    for (const msg of normalizedMessages) {
        const role = msg.role === 'user' ? 'user' : 'model';
        const parts: any[] = [];

        if (Array.isArray(msg.content)) {
            for (const part of msg.content) {
                if (part.type === 'text') {
                    parts.push({ text: part.text });
                } else if (part.type === 'image_url') {
                    // Extrai base64 e mime type
                    // Formato esperado: "data:image/jpeg;base64,..."
                    const url = part.image_url.url;
                    const match = url.match(/^data:(.+);base64,(.+)$/);
                    if (match) {
                        parts.push({
                            inline_data: {
                                mime_type: match[1],
                                data: match[2]
                            }
                        });
                    }
                }
            }
        } else {
            parts.push({ text: msg.content });
        }

        contents.push({ role, parts });
    }

    // 2. Configura e chama API
    const body = {
        contents,
        systemInstruction,
        generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
            responseMimeType: jsonMode ? "application/json" : "text/plain"
        }
    };

    try {
        const res = await fetch(`${ENDPOINT}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(`Gemini API Error: ${err.error?.message || res.statusText}`);
        }

        const data = await res.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error("Gemini retornou resposta vazia");

        // Auto-clean JSON if in jsonMode
        if (jsonMode) {
            text = text.trim();
            if (text.startsWith('```json')) text = text.slice(7);
            if (text.startsWith('```')) text = text.slice(3);
            if (text.endsWith('```')) text = text.slice(0, -3);
            text = text.trim();
        }

        return text;

    } catch (err: any) {
        console.error("Gemini Service Error:", err);
        throw err;
    }
}
