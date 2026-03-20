import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('API Base URL resolution', () => {
  beforeEach(() => {
    vi.resetModules()
    // Mock localStorage since api.ts calls it on load
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('should use VITE_API_URL and remove trailing slash', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com/api/')
    const { getApiBaseUrl, getWsBaseUrl } = await import('../api')

    expect(getApiBaseUrl()).toBe('https://api.example.com/api')
    expect(getWsBaseUrl()).toBe('wss://api.example.com/api')
  })

  it('should format http to ws', async () => {
    vi.stubEnv('VITE_API_URL', 'http://api.local.dev/v1')
    const { getApiBaseUrl, getWsBaseUrl } = await import('../api')

    expect(getApiBaseUrl()).toBe('http://api.local.dev/v1')
    expect(getWsBaseUrl()).toBe('ws://api.local.dev/v1')
  })

  it('should fallback to defaultApiUrl when VITE_API_URL is missing', async () => {
    // Vite resolves `import.meta.env` properties statically or via process.env fallback.
    // If not set, it relies on the fallback logic.
    delete process.env.VITE_API_URL
    const { getApiBaseUrl, getWsBaseUrl } = await import('../api')

    expect(getApiBaseUrl()).toBe('http://localhost:4000')
    expect(getWsBaseUrl()).toBe('ws://localhost:4000')
  })

  it('should resolve relative VITE_API_URL using window.location.origin', async () => {
    vi.stubEnv('VITE_API_URL', '/api')
    vi.stubGlobal('window', { location: { origin: 'https://app.example.com' } })
    const { getApiBaseUrl, getWsBaseUrl } = await import('../api')

    expect(getApiBaseUrl()).toBe('https://app.example.com/api')
    expect(getWsBaseUrl()).toBe('wss://app.example.com/api')
  })

  it('should throw Error if window is undefined and URL is relative', async () => {
    vi.stubEnv('VITE_API_URL', '/api')
    // Ensure window is undefined
    vi.stubGlobal('window', undefined)

    await expect(async () => await import('../api')).rejects.toThrow()
  })
})
