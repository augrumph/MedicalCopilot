
const GEMINI_API_KEY = 'AIzaSyAibYRaf69MsUqJPir3Ahs9Ia7mxEJ8kH8';
const MODEL_NAME = 'gemini-3-flash-preview';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

// Mock base64 image (1x1 red pixel)
const MOCK_IMAGE_B64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wAALCAABAAEBAREA/8QAAFhPUThQUQAABAAAAAABAAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKjQ2Nzk7Pj9AQkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/aAAgBAQABPxD/2Q==";

async function callGemini(messages, options = {}) {
    const { systemPrompt, temperature = 0.2, maxTokens = 2000, jsonMode = false } = options;

    const contents = [];
    let systemInstruction = undefined;

    if (systemPrompt) {
        systemInstruction = { parts: [{ text: systemPrompt }] };
    }

    const normalizedMessages = Array.isArray(messages) && !messages[0].role
        ? [{ role: 'user', content: messages }]
        : messages;

    for (const msg of normalizedMessages) {
        const role = msg.role === 'user' ? 'user' : 'model';
        const parts = [];

        if (Array.isArray(msg.content)) {
            for (const part of msg.content) {
                if (part.type === 'text') {
                    parts.push({ text: part.text });
                } else if (part.type === 'image_url') {
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
            const txt = await res.text();
            throw new Error(`Gemini API Error: ${res.statusText} - ${txt}`);
        }

        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;

    } catch (err) {
        console.error("Gemini Service Error:", err);
        throw err;
    }
}

async function runTests() {
    console.log('🚀 Iniciando Testes de Conexão Gemini API (Node.js Standalone)...\n');

    try {
        // 1. Text Test
        console.log('1️⃣ Teste de Texto Simples:');
        const textRes = await callGemini([{ role: 'user', content: 'Olá, teste de conexão.' }]);
        console.log('   Resposta:', textRes ? textRes.trim() : 'VAZIO');

        // 2. JSON Mode Test
        console.log('\n2️⃣ Teste de Modo JSON:');
        const jsonRes = await callGemini([{ role: 'user', content: 'Gere JSON: { "ok": true }' }], { jsonMode: true });
        console.log('   Resposta:', jsonRes ? jsonRes.trim() : 'VAZIO');

        // 3. Vision Test
        console.log('\n3️⃣ Teste de Visão (Imagem Base64):');
        const visionContent = [
            { type: 'text', text: 'Descreva esta imagem de teste.' },
            { type: 'image_url', image_url: { url: MOCK_IMAGE_B64 } }
        ];
        const visionRes = await callGemini(visionContent);
        console.log('   Resposta:', visionRes ? visionRes.trim() : 'VAZIO');

        console.log('\n✅ SUCESSO! API Conectada e Operacional.');

    } catch (error) {
        console.error('\n❌ FALHA:', error);
        process.exit(1);
    }
}

runTests();
