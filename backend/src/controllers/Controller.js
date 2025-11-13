import { AppError } from '../exceptions/AppError.js'
import { formatZodErrors } from '../utils/formatZodErrors.js'

/**
 * Gera um controller genérico com operações CRUD
 * @param {Object} Service - Serviço que implementa as operações CRUD
 * @param {Object} Schema - Schema Zod para validação dos dados
 * @param {string} entityName - Nome da entidade para mensagens de erro (ex: "Usuário", "Plano alimentar")
 * @param {Function} customTransform - Função opcional para transformar dados antes da validação
 * @returns {Object} Controller com métodos search, insert, update e remove
 */

export const generateCrudController = (Service, Schema, entityName = 'Item', customTransform = null) => ({
  async search(req, res, next) {
    try {
      const { data, total } = await Service.search(req.query)
      return res.status(200).json({ data, total })
    } catch (err) {
      next(err)
    }
  },

  async insert(req, res, next) {
    try {
      let data = req.body
      if (customTransform) data = customTransform(data)

      const parseResult = Schema.safeParse(data)
      if (!parseResult.success) {
        const errors = formatZodErrors(parseResult.error)
        return res.status(422).json({ error: true, data: errors })
      }

      // Usa os dados processados (inclui preprocess de datas/horário)
      data = parseResult.data

      const result = await Service.insert(data)
      return res.status(201).json(result)
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          error: true,
          field: err.field || null,
          data: err.details
        })
      }
      next(err)
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params
      let data = req.body
      if (customTransform) data = customTransform(data)

      const parseResult = Schema.safeParse(data)
      if (!parseResult.success) {
        const errors = formatZodErrors(parseResult.error)
        return res.status(422).json({ error: true, data: errors })
      }

      if (!id) {
        return res.status(400).json({
          errors: [{ message: 'ID não informado.' }]
        })
      }

      data = parseResult.data

      const result = await Service.update(Number(id), data)
      return res.status(200).json(result)
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          error: true,
          field: err.field || null,
          data: err.details
        })
      }
      next(err)
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = req.params
      if (!id) {
        return res.status(400).json({
          errors: [{ message: 'ID não informado.' }]
        })
      }

      const deletedItem = await Service.remove(Number(id))
      if (!deletedItem) {
        return res.status(404).json({
          errors: [{ message: `${entityName} não encontrado.` }]
        })
      }

      return res.status(200).json({ message: `${entityName} removido com sucesso.` })
    } catch (err) {
      next(err)
    }
  }
})
