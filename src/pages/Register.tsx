import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { saveUser, isEmailRegistered, type User } from '../utils/userStorage'

interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const initialForm: FormData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!form.fullName.trim()) {
    errors.fullName = 'Full name is required.'
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!form.password) {
    errors.password = 'Password is required.'
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

export default function Register() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    if (isEmailRegistered(form.email)) {
      setMessage({
        type: 'error',
        text: 'This email is already registered. Please log in instead.',
      })
      return
    }

    const user: User = {
      id: crypto.randomUUID(),
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      createdAt: new Date().toISOString(),
    }

    saveUser(user)

    setForm(initialForm)
    setMessage({
      type: 'success',
      text: 'Registration successful! Redirecting to login...',
    })

    setTimeout(() => navigate('/login'), 1500)
  }

  return (
    <section className="auth page">
      <div className="auth__card">
        <h1 className="auth__title">Create an account</h1>
        <p className="auth__subtitle">Join PenMart to buy and sell pens.</p>

        {message && (
          <div className={`alert alert--${message.type}`} role="status">
            {message.text}
          </div>
        )}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form__field">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Jane Doe"
            />
            {errors.fullName && <span className="form__error">{errors.fullName}</span>}
          </div>

          <div className="form__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
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
              placeholder="At least 6 characters"
            />
            {errors.password && <span className="form__error">{errors.password}</span>}
          </div>

          <div className="form__field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && (
              <span className="form__error">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="btn btn--block">
            Register
          </button>
        </form>

        <p className="auth__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  )
}
