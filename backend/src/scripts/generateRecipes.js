import { generateRecipes } from '../utils/useGeneratePopulateAI.js';

async function main() {
  console.log('='.repeat(60));
  console.log('🤖 GERANDO RECEITAS COM IA');
  console.log('='.repeat(60));
  console.log('');
  try {
    await generateRecipes(1000, 20, 1); // 1000 receitas, 50 por lote, concorrência 1
    console.log('✅ recipes.json gerado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao gerar receitas:', error.message);
  }
}

main();
