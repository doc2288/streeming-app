import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../utils/password'

describe('password utils', () => {
  it('hashes and verifies a password', async () => {
    const hash = await hashPassword('secret123')
    expect(hash).not.toBe('secret123')
    expect(hash.startsWith('$2a$')).toBe(true)
    const ok = await verifyPassword('secret123', hash)
    expect(ok).toBe(true)
  })

  it('rejects wrong password', async () => {
    const hash = await hashPassword('correct')
    const ok = await verifyPassword('wrong', hash)
    expect(ok).toBe(false)
  })

  it('produces different hashes for same password', async () => {
    const h1 = await hashPassword('test1234')
    const h2 = await hashPassword('test1234')
    expect(h1).not.toBe(h2)
  })
})
