export const generateCrudApi = (Controller) => ({
  insert: (req, res, next) => Controller.insert(req, res, next).catch(next),
  search: (req, res, next) => Controller.search(req, res, next).catch(next),
  update: (req, res, next) => Controller.update(req, res, next).catch(next),
  remove: (req, res, next) => Controller.remove(req, res, next).catch(next),
})
