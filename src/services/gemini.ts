
// Read Gemini API Key from environment variable
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Gemini 3 Flash — Pro-level intelligence with Flash speed and efficiency
const MODEL_NAME = 'gemini-3-flash-preview';

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

interface CallGeminiOptions {
    systemPrompt?: string;
    /**
     * Gemini 3 docs: keep at 1.0 (default).
     * Values below 1.0 cause looping/degraded reasoning on Gemini 3.
     */
    temperature?: number;
    maxTokens?: number;
    /**
     * Uses native application/json response type.
     * NOTE: incompatible with thinkingLevel — when jsonMode=true,
     * thinkingLevel is automatically ignored to avoid the
     * "model output empty" error.
     */
    jsonMode?: boolean;
    /**
     * Gemini native JSON schema. When provided together with jsonMode=true,
     * the model is constrained to produce JSON that matches the schema exactly,
     * eliminating truncated or malformed responses.
     */
    responseSchema?: object;
    /**
     * Gemini 3 thinkingLevel — controls reasoning depth.
     * For Flash: 'minimal' is extremely fast, 'low' is good for most tasks.
     */
    thinkingLevel?: 'minimal' | 'low' | 'medium' | 'high';
}

/**
 * Calls the Gemini 3 Flash API.
 *
 * When thinkingLevel is set and jsonMode=false, the model uses deep
 * reasoning before answering. The prompt must explicitly request JSON
 * format in this case — safeParseJSON handles stripping code fences.
 *
 * When jsonMode=true, thinkingLevel is ignored (API incompatibility).
 */
export async function callGemini(
    messages: any[],
    options: CallGeminiOptions = {}
): Promise<string> {
    const {
        systemPrompt,
        temperature = 1.0,
        maxTokens = 4096,
        jsonMode = false,
        responseSchema,
        thinkingLevel,
    } = options;

    if (!GEMINI_API_KEY) {
        throw new Error('VITE_GEMINI_API_KEY não configurada. Verifique o arquivo .env');
    }

    // ── System instruction ───────────────────────────────────────────────
    let systemInstruction: any = undefined;
    if (systemPrompt) {
        systemInstruction = { parts: [{ text: systemPrompt }] };
    }

    // ── Normalize messages → Gemini format ───────────────────────────────
    // Supports:
    //   A) Raw parts array: [{ type:'text', text }, { type:'image_url', image_url:{url} }]
    //   B) Chat messages:   [{ role:'user', content: ... }]
    const normalizedMessages: { role: string; content: any[] }[] =
        Array.isArray(messages) && !messages[0]?.role
            ? [{ role: 'user', content: messages }]
            : messages;

    const contents: { role: string; parts: any[] }[] = [];

    for (const msg of normalizedMessages) {
        const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';
        const rawParts: any[] = Array.isArray(msg.content)
            ? msg.content
            : [{ type: 'text', text: String(msg.content) }];

        const parts: any[] = [];
        for (const part of rawParts) {
            if (part.type === 'text') {
                parts.push({ text: part.text });
            } else if (part.type === 'image_url') {
                const url: string = part.image_url?.url ?? part.url ?? '';
                const match = url.match(/^data:(.+);base64,(.+)$/);
                if (match) {
                    parts.push({ inline_data: { mime_type: match[1], data: match[2] } });
                } else {
                    console.warn('[Gemini] image_url inválida (sem base64), ignorando.');
                }
            } else if (part.inline_data) {
                // Already Gemini format
                parts.push(part);
            }
        }

        if (parts.length > 0) contents.push({ role, parts });
    }

    // ── Build generation config ──────────────────────────────────────────
    // jsonMode  → responseMimeType=application/json, thinking disabled by API
    // thinkingLevel set → explicit thinking budget, no jsonMode
    // neither   → explicitly disable thinking (thinkingBudget:0) so the model
    //             does NOT silently use a default thinking budget that eats into
    //             maxOutputTokens and causes truncated responses.
    const generationConfig: any = {
        temperature,
        maxOutputTokens: maxTokens,
    };

    if (jsonMode) {
        generationConfig.responseMimeType = 'application/json';
        if (responseSchema) {
            generationConfig.responseSchema = responseSchema;
        }
        // Note: thinkingConfig is incompatible with responseMimeType — omit it.
    } else if (thinkingLevel) {
        generationConfig.thinkingConfig = { thinkingLevel };
    } else {
        // Explicitly disable thinking to prevent implicit token consumption.
        generationConfig.thinkingConfig = { thinkingBudget: 0 };
    }

    const body: any = { contents, generationConfig };
    if (systemInstruction) body.systemInstruction = systemInstruction;

    // ── Log ─────────────────────────────────────────────────────────────
    const mode = jsonMode ? 'json-native' : thinkingLevel ? `thinking:${thinkingLevel}` : 'text';
    const imageParts = contents.flatMap(c => c.parts).filter(p => p.inline_data).length;
    console.log(`[Gemini] ${MODEL_NAME} | mode:${mode} | images:${imageParts} | maxTokens:${maxTokens}`);

    // ── HTTP request ─────────────────────────────────────────────────────
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 120_000);

    let res: Response;
    try {
        res = await fetch(`${ENDPOINT}?key=${GEMINI_API_KEY}`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(body),
            signal:  controller.signal,
        });
    } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        if (fetchErr.name === 'AbortError') {
            throw new Error('Gemini: tempo limite excedido. Tente novamente.');
        }
        throw fetchErr;
    }
    clearTimeout(timeoutId);

    if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: { message: res.statusText } }));
        const msg = errData?.error?.message ?? res.statusText;
        console.error('[Gemini] API Error:', res.status, msg);
        throw new Error(`Gemini API Error (${res.status}): ${msg}`);
    }

    const data = await res.json();

    if (data.promptFeedback?.blockReason) {
        const reason = data.promptFeedback.blockReason;
        console.warn('[Gemini] Prompt bloqueado:', reason);
        throw new Error(`Gemini bloqueou a requisição: ${reason}`);
    }

    // Concatenate ALL non-thinking parts. Some model versions split JSON into
    // multiple text parts. Filter out thinking parts ({ thought: true }).
    const allParts: any[] = data.candidates?.[0]?.content?.parts ?? [];

    const outputText = allParts
        .filter((p: any) => !p.thought && typeof p.text === 'string')
        .map((p: any) => p.text)
        .join('');

    let text = outputText.trim();

    if (!text || text.length === 0) {
        throw new Error('Gemini retornou resposta vazia.');
    }

    // Advanced JSON Extraction Logic:
    // 1. Try to find a complete JSON block inside markdown fences
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
        text = jsonMatch[1].trim();
    } else {
        // 2. If no fences, find the first '{' and last '}'
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            text = text.slice(firstBrace, lastBrace + 1).trim();
        }
    }

    if (!text) {
        throw new Error('Gemini retornou conteúdo não-JSON ou malformado.');
    }

    return text;
}
