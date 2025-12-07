import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Gera um repository genérico com operações CRUD
 * @param {string} modelName - Nome do modelo no Prisma (ex: 'user', 'food', 'mealPlan')
 * @param {Object} options - Configurações opcionais
 * @param {boolean} options.softDelete - Se deve usar soft delete (padrão: true)
 * @param {string} options.defaultOrderBy - Campo padrão para ordenação (padrão: 'id')
 * @param {Array} options.defaultIncludes - Relacionamentos a incluir por padrão
 * @returns {Object} Repository com métodos search, create, update e remove
 */
export const generateCrudRepository = (modelName, options = {}) => {
  const {
    softDelete = true,
    defaultOrderBy = "id",
    defaultIncludes = {},
  } = options;

  return {
    async search(object = {}) {
      const {
        filters = [],
        limit = 10,
        page = 1,
        order = "asc",
        orderColumn,
      } = object;


      const take = parseInt(limit, 10);
      const currentPage = parseInt(page, 10);

      if (isNaN(take) || isNaN(currentPage)) {
        throw new Error("Parâmetros de paginação 'limit' e 'page' devem ser números válidos.");
      }

      const where = {};

      if (softDelete) {
        where.deleted_at = null;
      }
      let filtersParsed = filters;
      if (typeof filters === 'string') {
        try {
          filtersParsed = JSON.parse(filters);
        } catch (e) {
          filtersParsed = [];
        }
      }
      const filtersArray = Array.isArray(filtersParsed) ? filtersParsed : [];


      if (filtersArray.length > 0) {
        if (!where.AND) {
          where.AND = [];
        }
        filtersArray.forEach((filter) => {
          const { field, value, operator = "equals" } = filter;
          if (field && value !== undefined) {
            where.AND.push({ [field]: { [operator]: value } });
          }
        });
      }

      const total = await prisma[modelName].count({ where });

      const orderField = orderColumn || defaultOrderBy;

      const data = await prisma[modelName].findMany({
        where,
        take: take,
        skip: (currentPage - 1) * take,
        orderBy: { [orderField]: order === "asc" ? "asc" : "desc" },
        include: defaultIncludes,
      });

      return { data, total };
    },

    async create(data, tx = null) {
      const client = tx || prisma;
      return await client[modelName].create({
        data: {
          ...data,
          created_at: new Date(),
        },
      });
    },

    async update(id, data) {
      // console.log('data', data)
      return await prisma[modelName].update({
        where: { id },
        data: {
          ...data,
          updated_at: new Date(),
        },
      });
    },

    async remove(id) {
      if (softDelete) {
        return await prisma[modelName].update({
          where: { id },
          data: { deleted_at: new Date() },
        });
      } else {
        return await prisma[modelName].delete({
          where: { id },
        });
      }
    },

    // Método auxiliar para buscar por ID
    async findById(id) {
      const where = { id };

      if (softDelete) {
        where.deleted_at = null;
      }

      return await prisma[modelName].findUnique({
        where,
        include: defaultIncludes,
      });
    },

    // Método auxiliar para buscar por campo único
    async findUnique(where) {
      return await prisma[modelName].findUnique({
        where,
        include: defaultIncludes,
      });
    },

    // Método auxiliar para buscar por email (comum em muitos models)
    async findByEmail(email) {
      return await prisma[modelName].findUnique({
        where: { email },
      });
    },
  };
};
