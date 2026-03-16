import { describe, it, expect, afterEach } from 'vitest'
import { getMediaServerUrl } from '../config/env'

describe('env', () => {
  const originalEnv = import.meta.env.VITE_MEDIA_SERVER_URL as string | undefined

  afterEach(() => {
    import.meta.env.VITE_MEDIA_SERVER_URL = originalEnv as any
  })

  it('getMediaServerUrl returns default when invalid URL is configured', () => {
    import.meta.env.VITE_MEDIA_SERVER_URL = 'not-a-url'
    expect(getMediaServerUrl()).toBe('http://localhost:8080')
  })

  it('getMediaServerUrl returns default when URL is undefined', () => {
    import.meta.env.VITE_MEDIA_SERVER_URL = undefined
    expect(getMediaServerUrl()).toBe('http://localhost:8080')
  })

  it('getMediaServerUrl returns configured URL when valid', () => {
    import.meta.env.VITE_MEDIA_SERVER_URL = 'https://example.com'
    expect(getMediaServerUrl()).toBe('https://example.com')
  })

  it('getMediaServerUrl normalizes valid URL with trailing slash', () => {
    import.meta.env.VITE_MEDIA_SERVER_URL = 'https://example.com/'
    expect(getMediaServerUrl()).toBe('https://example.com')
  })
})
