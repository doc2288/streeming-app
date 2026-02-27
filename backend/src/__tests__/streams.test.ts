import { describe, it, expect } from 'vitest'
import { generateStreamKey } from '../utils/streams'

describe('stream utils', () => {
  it('generates a 32-char hex stream key', () => {
    const key = generateStreamKey()
    expect(key).toHaveLength(32)
    expect(/^[0-9a-f]+$/.test(key)).toBe(true)
  })

  it('generates unique keys', () => {
    const keys = new Set(Array.from({ length: 100 }, () => generateStreamKey()))
    expect(keys.size).toBe(100)
  })
})
