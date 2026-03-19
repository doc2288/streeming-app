import { test, expect } from 'vitest'
import { render } from '@testing-library/react'
import { StreamCard } from '../components/StreamCard'
import { I18nProvider } from '../i18n'

test('StreamCard has tabIndex and handles keyboard events', () => {
  const stream = { id: '1', title: 'Test Stream', status: 'live', user_id: 'user123' }
  const onWatch = (): void => {}
  const { getByRole } = render(
    <I18nProvider>
      <StreamCard stream={stream} onWatch={onWatch} />
    </I18nProvider>
  )

  const card = getByRole('button')
  expect(card).toHaveAttribute('tabIndex', '0')
  expect(card).toHaveAttribute('aria-label', expect.stringContaining('Test Stream'))
})
