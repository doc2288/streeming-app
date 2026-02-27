import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_URL
})

const TOKEN_KEY = 'streeming_access_token'
const REFRESH_KEY = 'streeming_refresh_token'

export function getApiBaseUrl (): string {
  return API_URL
}

export function getWsBaseUrl (): string {
  const url = new URL(API_URL)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  return url.origin
}

export function setAuthToken (token: string | null): void {
  if (token != null) {
    localStorage.setItem(TOKEN_KEY, token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem(TOKEN_KEY)
    delete api.defaults.headers.common.Authorization
  }
}

export function getStoredToken (): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setRefreshToken (token: string | null): void {
  if (token != null) {
    localStorage.setItem(REFRESH_KEY, token)
  } else {
    localStorage.removeItem(REFRESH_KEY)
  }
}

export function getRefreshToken (): string | null {
  return localStorage.getItem(REFRESH_KEY)
}

export function clearAuth (): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  delete api.defaults.headers.common.Authorization
}

const storedToken = getStoredToken()
if (storedToken != null) {
  api.defaults.headers.common.Authorization = `Bearer ${storedToken}`
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const skipRefreshUrls = ['/auth/login', '/auth/register', '/auth/refresh']
    const shouldSkipRefresh = skipRefreshUrls.some(url => original.url?.includes(url))
    if (
      error.response?.status === 401 &&
      original != null &&
      !original._retry &&
      !shouldSkipRefresh
    ) {
      original._retry = true
      const refresh = getRefreshToken()
      if (refresh != null) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken: refresh })
          const { accessToken, refreshToken: newRefresh } = res.data
          setAuthToken(accessToken)
          setRefreshToken(newRefresh)
          original.headers.Authorization = `Bearer ${accessToken}`
          return await api(original)
        } catch {
          clearAuth()
        }
      }
    }
    return await Promise.reject(error)
  }
)
