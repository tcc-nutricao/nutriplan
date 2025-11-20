import { SearchController } from '../controllers/SearchController.js'
import { authenticate } from '../middleware/index.js'

export default (router) => {
  router.get('/search/recipes', authenticate, SearchController.searchRecipes)
  router.get('/search/foods', authenticate, SearchController.searchFoods)
  router.get('/search/patients', authenticate, SearchController.searchPatients)
}
