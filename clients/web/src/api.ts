import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

const defaultApiUrl = import.meta.env.DEV === true
  ? 'http://localhost:4000'
  : typeof window !== 'undefined'
    ? `${window.location.origin}/api`
    : 'http://localhost:4000'
const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? defaultApiUrl

function normalizeApiUrl (value: string): URL {
  if (typeof window !== 'undefined') {
    return new URL(value, window.location.origin)
  }
  return new URL(value)
}

const resolvedApiUrl = normalizeApiUrl(API_URL)
const apiBasePath = resolvedApiUrl.pathname.replace(/\/$/, '')

export const api = axios.create({
  baseURL: `${resolvedApiUrl.origin}${apiBasePath}`
})

const TOKEN_KEY = 'streeming_access_token'
const REFRESH_KEY = 'streeming_refresh_token'

export function getApiBaseUrl (): string {
  return `${resolvedApiUrl.origin}${apiBasePath}`
}

export function getWsBaseUrl (): string {
  const protocol = resolvedApiUrl.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${resolvedApiUrl.host}${apiBasePath}`
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

let refreshInFlight: Promise<string | null> | null = null

async function refreshAccessToken (): Promise<string | null> {
  if (refreshInFlight != null) return await refreshInFlight

  refreshInFlight = (async () => {
    const refresh = getRefreshToken()
    if (refresh == null) return null
    try {
      const res = await axios.post<{ accessToken: string, refreshToken: string }>(
        `${getApiBaseUrl()}/auth/refresh`,
        { refreshToken: refresh }
      )
      const { accessToken, refreshToken: newRefresh } = res.data
      setAuthToken(accessToken)
      setRefreshToken(newRefresh)
      return accessToken
    } catch {
      clearAuth()
      return null
    } finally {
      refreshInFlight = null
    }
  })()

  return await refreshInFlight
}

type RetryRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const axiosError = error as AxiosError
    const original = axiosError.config as RetryRequestConfig | undefined
    const skipRefreshUrls = ['/auth/login', '/auth/register', '/auth/refresh']
    const shouldSkipRefresh = skipRefreshUrls.some(url => original?.url?.includes(url))
    if (
      axiosError.response?.status === 401 &&
      original != null &&
      original._retry !== true &&
      !shouldSkipRefresh
    ) {
      original._retry = true
      const accessToken = await refreshAccessToken()
      if (accessToken != null) {
        original.headers.Authorization = `Bearer ${accessToken}`
        return await api(original)
      }
    }
    return await Promise.reject(error)
  }
)
