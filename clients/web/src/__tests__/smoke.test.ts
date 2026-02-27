import { describe, it, expect } from 'vitest'

describe('ui smoke', () => {
  it('runs vitest', () => {
    expect(true).toBe(true)
  })

  it('API URL defaults to localhost:4000', () => {
    const url = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
    expect(url).toContain('localhost')
  })
})
