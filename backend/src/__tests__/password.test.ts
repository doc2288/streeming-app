import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../utils/password'

describe('password utils', () => {
  it('hashes and verifies a password', async () => {
    const hash = await hashPassword('secret123')
    expect(hash).not.toBe('secret123')
    const ok = await verifyPassword('secret123', hash)
    expect(ok).toBe(true)
  })
})
