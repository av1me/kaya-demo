import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../utils'
import Auth from '../../pages/Auth'

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn()
  }
})

describe('Auth Component', () => {
  it('renders login form', () => {
    render(<Auth />)
    
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(<Auth />)
    
    const signInButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(signInButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    render(<Auth />)
    
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    
    const signInButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(signInButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
    })
  })

  it('toggles password visibility', () => {
    render(<Auth />)
    
    const passwordInput = screen.getByLabelText(/password/i)
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i })
    
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
}) 