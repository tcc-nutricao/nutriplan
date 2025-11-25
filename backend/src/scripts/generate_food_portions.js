
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const foodsPath = path.join(__dirname, '../assets/foods.json');
const unitsPath = path.join(__dirname, '../assets/units_of_measurement.json');
const portionsPath = path.join(__dirname, '../assets/food_portions.json');

const foods = JSON.parse(fs.readFileSync(foodsPath, 'utf-8'));
const units = JSON.parse(fs.readFileSync(unitsPath, 'utf-8'));


const portions = [];

const standardPortions = {
  'Maçã': { 'Unidade': 150, 'Fatia': 20 },
  'Banana': { 'Unidade': 100, 'Fatia': 15 },
  'Laranja': { 'Unidade': 180, 'Gomo': 15 },
  'Pera': { 'Unidade': 170, 'Fatia': 20 },
  'Uva': { 'Unidade': 5, 'Xícara': 150 },
  'Morango': { 'Unidade': 12, 'Xícara': 150 },
  'Abacaxi': { 'Fatia': 80, 'Xícara': 160 },
  'Manga': { 'Unidade': 200, 'Fatia': 80, 'Xícara': 165 },
  'Mamão Papaia': { 'Unidade': 250, 'Fatia': 100 },
  'Kiwi': { 'Unidade': 75 },
  'Melancia': { 'Fatia': 200, 'Xícara': 150 },
  'Abacate': { 'Unidade': 200, 'Colher de Sopa': 20 },

  'Arroz Branco': { 'Colher de Sopa': 25, 'Xícara': 150 },
  'Arroz Branco Cozido': { 'Colher de Sopa': 25, 'Xícara': 150 },
  'Arroz Integral Cozido': { 'Colher de Sopa': 25, 'Xícara': 150 },
  'Feijão Preto Cozido': { 'Xícara': 170, 'Colher de Sopa': 30 },
  'Macarrão Cozido': { 'Xícara': 140, 'Pegador': 100 },
  'Aveia em Flocos': { 'Colher de Sopa': 15, 'Xícara': 80 },
  'Aveia': { 'Colher de Sopa': 15, 'Xícara': 80 },
  'Quinoa Cozida': { 'Colher de Sopa': 20, 'Xícara': 185 },
  'Batata Doce Cozida': { 'Unidade': 150, 'Rodela': 30 },
  'Batata Inglesa Cozida': { 'Unidade': 150, 'Colher de Sopa': 30 },
  'Pão Francês': { 'Unidade': 50 },
  'Pão de Forma Integral': { 'Fatia': 25 },
  'Pão Integral': { 'Fatia': 25 },

  'Ovo Cozido': { 'Unidade': 50 },
  'Ovo': { 'Unidade': 50 },
  'Peito de Frango': { 'Unidade': 150 },
  'Carne Bovina (Patinho)': { 'Bife': 100, 'Colher de Sopa': 30 },
  'Carne Moída': { 'Colher de Sopa': 25 },
  'Peixe': { 'Filé': 120 },
  'Salmão Grelhado': { 'Filé': 120 },
  'Atum em Lata (em água)': { 'Lata': 170, 'Colher de Sopa': 20 },
  'Sardinha em Lata (em óleo)': { 'Lata': 125, 'Unidade': 30 },

  'Queijo Mussarela': { 'Fatia': 20 },
  'Queijo Minas Frescal': { 'Fatia': 30 },
  'Iogurte Natural Desnatado': { 'Pote': 170, 'Colher de Sopa': 20 },
  'Manteiga': { 'Colher de Sopa': 14, 'Colher de Chá': 5, 'Pontinha da Faca': 2 },

  'Alface': { 'Folha': 10 },
  'Tomate': { 'Unidade': 120, 'Rodela': 15 },
  'Cenoura': { 'Unidade': 100, 'Colher de Sopa': 15 },
  'Brócolis Cozido': { 'Buquê': 30, 'Xícara': 150 },
  
  'Azeite de Oliva Extra Virgem': { 'Colher de Sopa': 13, 'Colher de Chá': 5 },
  'Mel': { 'Colher de Sopa': 21, 'Colher de Chá': 7 },
  'Açúcar': { 'Colher de Sopa': 12, 'Colher de Chá': 4 },
  'Sal': { 'Colher de Chá': 5, 'Pitada': 1 },
  'Castanha-do-Pará': { 'Unidade': 4 },
  'Nozes': { 'Unidade': 5 },
  'Amêndoas': { 'Unidade': 1.2 }
};

const genericPortions = {
  'Colher de Sopa': 15, 
  'Colher de Chá': 5,
  'Xícara': 240, 
  'Unidade': 100 
};

foods.forEach(food => {
  const mapping = standardPortions[food.name];
  
  if (mapping) {
    Object.entries(mapping).forEach(([unitName, weight]) => {
      portions.push({
        food_name: food.name,
        unit_name: unitName,
        gram_weight: weight,
        description: `1 ${unitName}`
      });
    });
  } else {
    if (/Arroz|Feijão|Aveia|Farinha|Açúcar|Sal|Azeite|Óleo|Leite|Iogurte|Creme/.test(food.name)) {
       portions.push({
        food_name: food.name,
        unit_name: 'Colher de Sopa',
        gram_weight: 15,
        description: '1 Colher de Sopa (aprox)'
      });
    }
  }
});

fs.writeFileSync(portionsPath, JSON.stringify(portions, null, 2));
console.log(`Generated ${portions.length} portions.`);
