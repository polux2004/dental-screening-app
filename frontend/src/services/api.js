import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  timeout: 30000,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data
    return Promise.reject(data ?? err)
  }
)

/**
 * Envía la imagen al backend para detección.
 * @param {File} file
 * @param {string} photoType  — mandibular o maxilar
 * @returns {Promise<DetectionResponse>}
 */
export async function detectImage(file, photoType) {
  const form = new FormData()
  form.append('file', file)
  form.append('photo_type', photoType)
  const { data } = await api.post('/detect/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export default api
