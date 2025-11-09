import { generateFoods } from '../utils/useGeneratePopulateAI.js';

async function main() {
  console.log('='.repeat(60));
  console.log('🤖 GERANDO ALIMENTOS COM IA');
  console.log('='.repeat(60));
  console.log('');
  try {
    await generateFoods(1000, 50, 1); // 1000 alimentos, 50 por lote, concorrência 1
    console.log('✅ foods.json gerado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao gerar alimentos:', error.message);
  }
}

main();
