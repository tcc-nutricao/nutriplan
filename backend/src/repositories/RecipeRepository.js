import { generateCrudRepository } from './Repository.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultIncludes = {
  recipeFoods: {
    include: {
      food: true,
      unit_of_measurement: true, 
      preparationMethod: true
    }
  },
  recipePreferences: {
    include: {
      preference: {
        select: {
          id: true,
          name: true,
          icon: true
        }
      }
    }
  }
}

const baseRepository = generateCrudRepository('recipe', {
  softDelete: true,
  defaultOrderBy: 'id',
  defaultIncludes
})

export const RecipeRepository = {
  ...baseRepository,
  
  async addFavorite(userId, recipeId) {
    return prisma.favoriteRecipe.create({
      data: {
        id_user: userId,
        id_recipe: recipeId
      }
    })
  },

  async removeFavorite(userId, recipeId) {
    return prisma.favoriteRecipe.delete({
      where: {
        id_user_id_recipe: {
          id_user: userId,
          id_recipe: recipeId
        }
      }
    })
  },

  async findFavoritesByUserId(userId) {
    return prisma.favoriteRecipe.findMany({
      where: {
        id_user: userId
      },
      include: {
        recipe: {
          include: defaultIncludes
        }
      }
    })
  },

  async isFavorite(userId, recipeId) {
    const favorite = await prisma.favoriteRecipe.findUnique({
      where: {
        id_user_id_recipe: {
          id_user: userId,
          id_recipe: recipeId
        }
      }
    })
    return !!favorite
  }
}
