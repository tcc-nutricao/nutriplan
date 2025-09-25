const get = async (route, params = {}) => {
  const { $axios } = useNuxtApp()  
  try {
    const res = await $axios.get(`/${route}`, { params })
    return { ...res.data, status: res.status }
  } catch (err) {
    return { error: true, ...err.response, status: err.response?.status }
  }
}

const search = async (route, objectParams) => {
  const { $axios } = useNuxtApp()
  try {
    const res = await $axios.get(`/${route}`, { params: objectParams })
    return { ...res.data, status: res.status }
  } catch (err) {
    return { error: true, ...err.response, status: err.response?.status }
  }
}

const insert = async (route, object, itemMessage) => {
  const { $axios } = useNuxtApp()
  let headers = {}

  for (const key in object) {
    if (object[key] instanceof File) {
      headers['Content-Type'] = 'multipart/form-data'
      break
    }
  }

  try {
    const res = await $axios.post(`/${route}`, object, { headers })
    return { ...res.data, status: res.status }
  } catch (err) {
    return { error: true, ...err.response, status: err.response?.status }
  }
}

const update = async (route, id, object, itemMessage) => {
  const { $axios } = useNuxtApp()
  try {
    const res = await $axios.patch(`/${route}/${id}`, object)

    return { ...res.data, status: res.status }
  } catch (err) {
    return { error: true, ...err.response, status: err.response?.status }
  }
}

const remove = async (route, id, itemMessage) => {
  const { $axios } = useNuxtApp()
  try {
    const res = await $axios.delete(`/${route}/${id}`)

    return { ...res.data, status: res.status }
  } catch (err) {
    return { error: true, ...err.response, status: err.response?.status }
  }
}

export { get, search, insert, update, remove }
