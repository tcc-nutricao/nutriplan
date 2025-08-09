import axiosInstance from './axiosConfig'
// import store from './store'

// Função GET
const get = async (route, params = {}) => {
  try {
    const res = await axiosInstance.get(route, { params })
    return { ...res.data, status: res.status }
  } catch (err) {
    return { error: true, ...err.response, status: err.response?.status }
  }
}

// Função SEARCH
const search = async (route, objectParams) => {
  try {
    const res = await axiosInstance.get(route, { params: objectParams })
    return { ...res.data, status: res.status }
  } catch (err) {
    return { error: true, ...err.response, status: err.response?.status }
  }
}

// Função INSERT
const insert = async (route, object, itemMessage) => {
  let headers = {}

  for (const key in object) {
    if (object[key] instanceof File) {
      headers['Content-Type'] = 'multipart/form-data'
      break
    }
  }

  try {
    const res = await axiosInstance.post(route, object, { headers })

    // if (itemMessage) {
    //   store.dispatch('setSuccess', {
    //     message: `Sucesso ao cadastrar ${itemMessage}!`,
    //   })
    // }

    return { ...res.data, status: res.status }
  } catch (err) {
    // if (itemMessage) {
    //   store.dispatch('setError', {
    //     message: `Erro ao cadastrar ${itemMessage}!`,
    //   })
    // }
    return { error: true, ...err.response, status: err.response?.status }
  }
}

// Função UPDATE
const update = async (route, id, object, itemMessage) => {
  try {
    const res = await axiosInstance.patch(`/${route}/${id}`, object)

    // if (itemMessage) {
    //   store.dispatch('setSuccess', {
    //     message: `Sucesso ao atualizar ${itemMessage}!`,
    //   })
    // }

    return { ...res.data, status: res.status }
  } catch (err) {
    // if (itemMessage) {
    //   store.dispatch('setError', {
    //     message: `Erro ao atualizar ${itemMessage}!`,
    //   })
    // }
    return { error: true, ...err.response, status: err.response?.status }
  }
}

// Função REMOVE
const remove = async (route, id, itemMessage) => {
  try {
    const res = await axiosInstance.delete(`/${route}/${id}`)

    // if (itemMessage) {
    //   store.dispatch('setSuccess', {
    //     message: `Sucesso ao remover ${itemMessage}!`,
    //   })
    // }

    return { ...res.data, status: res.status }
  } catch (err) {
    // if (itemMessage) {
    //   store.dispatch('setError', {
    //     message: `Erro ao remover ${itemMessage}!`,
    //   })
    // }
    return { error: true, ...err.response, status: err.response?.status }
  }
}

export { get, search, insert, update, remove }
