
import { callGemini } from '../src/services/gemini';

// Mock base64 image (1x1 red pixel)
const MOCK_IMAGE_B64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wAALCAABAAEBAREA/8QAAFhPUThQUQAABAAAAAABAAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKjQ2Nzk7Pj9AQkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/aAAgBAQABPxD/2Q==";

async function runTests() {
    console.log('🚀 Iniciando Testes de Conexão Gemini API...\n');

    try {
        // 1. Text Test
        console.log('1️⃣ Teste de Texto Simples:');
        const textRes = await callGemini([{ role: 'user', content: 'Olá, responda "Gemini Online" se você está me ouvindo.' }], { temperature: 0.1 });
        console.log('   Resposta:', textRes.trim());

        // 2. JSON Mode Test
        console.log('\n2️⃣ Teste de Modo JSON:');
        const jsonRes = await callGemini([{ role: 'user', content: 'Gere um JSON simples: { "status": "online", "model": "Gemini 3 Flash" }' }], { jsonMode: true, temperature: 0.1 });
        console.log('   Resposta:', jsonRes.trim());

        // 3. Vision Test
        console.log('\n3️⃣ Teste de Visão (Imagem Base64):');
        const visionContent = [
            { type: 'text', text: 'O que é esta imagem? Responda com uma palavra.' },
            { type: 'image_url', image_url: { url: MOCK_IMAGE_B64 } }
        ];
        // @ts-ignore
        const visionRes = await callGemini(visionContent, { temperature: 0.1 });
        console.log('   Resposta:', visionRes.trim());

        console.log('\n✅ TODOS OS TESTES CONCLUÍDOS COM SUCESSO!');

    } catch (error) {
        console.error('\n❌ ERRO NOS TESTES:', error);
        process.exit(1);
    }
}

runTests();
