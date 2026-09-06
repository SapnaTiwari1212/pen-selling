import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { authenticateUser } from '../utils/userStorage'
import { useAuth } from '../context/AuthContext'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

const initialForm: FormData = {
  email: '',
  password: '',
}

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!form.password) {
    errors.password = 'Password is required.'
  }

  return errors
}

export default function Login() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setError(null)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const user = authenticateUser(form.email, form.password)
    if (!user) {
      setError('Invalid email or password. Please try again.')
      setErrors({})
      return
    }

    login(user)
    navigate('/')
  }

  return (
    <section className="auth page">
      <div className="auth__card">
        <h1 className="auth__title">Welcome back</h1>
        <p className="auth__subtitle">Log in to continue.</p>

        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <span className="form__error">{errors.email}</span>}
          </div>

          <div className="form__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="form__error">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="btn btn--block">
            Log in
          </button>
        </form>

        <p className="auth__footer">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </section>
  )
}
