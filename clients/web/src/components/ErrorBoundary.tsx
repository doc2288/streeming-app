import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError (error: Error): State {
    return { error }
  }

  componentDidCatch (error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render (): ReactNode {
    if (this.state.error != null) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0e0e10',
          color: '#efeff1',
          fontFamily: "'Inter', sans-serif",
          padding: 24,
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Щось пішло не так</h1>
          <p style={{ color: '#adadb8', maxWidth: 480, lineHeight: 1.5 }}>
            Додаток зіткнувся з непередбаченою помилкою. Спробуйте перезавантажити сторінку.
          </p>
          <pre style={{
            marginTop: 16,
            padding: 12,
            background: '#1f1f23',
            borderRadius: 8,
            fontSize: 13,
            color: '#eb0400',
            maxWidth: '90vw',
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {this.state.error.message}
          </pre>
          <button
            onClick={() => { window.location.reload() }}
            style={{
              marginTop: 20,
              padding: '10px 24px',
              background: '#9147ff',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: 600
            }}
          >
            Перезавантажити
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
