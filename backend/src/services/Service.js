/**
 * Gera um service genérico com operações CRUD
 * @param {Object} Repository - Repository que implementa as operações CRUD
 * @param {Function} customSearch - Função opcional para customizar a busca
 * @param {Function} customInsert - Função opcional para customizar a inserção
 * @param {Function} customUpdate - Função opcional para customizar a atualização
 * @param {Function} customRemove - Função opcional para customizar a remoção
 * @returns {Object} Service com métodos search, insert, update e remove
 */
export const generateCrudService = (Repository, customSearch = null, customInsert = null, customUpdate = null, customRemove = null) => ({
  async search(object) {
    try {
      if (customSearch) {
        return await customSearch(object)
      }
      
      const { data = [], total = 0 } = await Repository.search(object)
      return { data, total }
    } catch (err) {
      console.error('Erro no search:', err)
      throw err
    }
  },

  async insert(data) {
    try {
      if (customInsert) {
        return await customInsert(data)
      }
      
      return await Repository.create({
        ...data
      })
    } catch (err) {
      console.error('Erro no insert:', err)
      throw err
    }
  },

  async update(id, data) {
    try {
      if (customUpdate) {
        return await customUpdate(id, data)
      }
      
      return await Repository.update(id, data)
    } catch (err) {
      console.error('Erro no update:', err)
      throw err
    }
  },

  async remove(id) {
    try {
      if (customRemove) {
        return await customRemove(id)
      }
      
      return await Repository.remove(id)
    } catch (err) {
      console.error('Erro no remove:', err)
      throw err
    }
  }
})
