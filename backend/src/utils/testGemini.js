import axios from 'axios';
import 'dotenv/config';
import 'dotenv/config';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;

async function testGemini() {
  try {
    console.log('Testando Gemini API com chave:', GEMINI_API_KEY);
    const response = await axios.post(
      geminiUrl,
      {
        contents: [{ parts: [{ text: 'Diga olá' }] }]
      }
    );
    console.log('Resposta Gemini:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Erro Gemini:', error.response.status, error.response.data);
    } else {
      console.error('Erro Gemini:', error.message);
    }
  }
}

testGemini();
