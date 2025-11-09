import { generateMealPlans } from '../utils/useGeneratePopulateAI.js';

async function main() {
  console.log('='.repeat(60));
  console.log('🤖 GERANDO PLANOS DE REFEIÇÃO COM IA');
  console.log('='.repeat(60));
  console.log('');
  try {
    await generateMealPlans(100, 20, 1); // 100 planos, 20 por lote, concorrência 1
    console.log('✅ mealplans.json gerado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao gerar planos de refeição:', error.message);
  }
}

main();
