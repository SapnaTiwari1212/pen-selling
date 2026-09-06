import { useState, type FormEvent } from 'react'
import { useNavigate, Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { addListing, type PenListing } from '../utils/listingStorage'

interface FormData {
  name: string
  brand: string
  description: string
  condition: 'New' | 'Like New' | 'Used'
  price: string
  contact: string
}

interface FormErrors {
  name?: string
  brand?: string
  description?: string
  price?: string
  contact?: string
  image?: string
}

const initialForm: FormData = {
  name: '',
  brand: '',
  description: '',
  condition: 'New',
  price: '',
  contact: '',
}

function validate(form: FormData, image: string | null): FormErrors {
  const errors: FormErrors = {}

  if (!image) {
    errors.image = 'Please upload a pen image.'
  }

  if (!form.name.trim()) {
    errors.name = 'Pen name is required.'
  }

  if (!form.brand.trim()) {
    errors.brand = 'Brand is required.'
  }

  if (!form.description.trim()) {
    errors.description = 'Description is required.'
  }

  if (!form.price.trim()) {
    errors.price = 'Price is required.'
  } else {
    const parsed = Number(form.price)
    if (Number.isNaN(parsed) || parsed <= 0) {
      errors.price = 'Please enter a valid price greater than 0.'
    }
  }

  if (!form.contact.trim()) {
    errors.contact = 'Contact information is required.'
  }

  return errors
}

export default function SellPen() {
  const { user } = useAuth()
  const [form, setForm] = useState<FormData>(initialForm)
  const [image, setImage] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState<string | null>(null)
  const navigate = useNavigate()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
      setErrors((prev) => ({ ...prev, image: undefined }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSuccess(null)

    const validationErrors = validate(form, image)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const listing: PenListing = {
      id: crypto.randomUUID(),
      sellerId: user.id,
      sellerName: user.fullName,
      sellerContact: form.contact.trim(),
      name: form.name.trim(),
      brand: form.brand.trim(),
      description: form.description.trim(),
      condition: form.condition,
      price: Number(form.price),
      image: image as string,
      createdAt: new Date().toISOString(),
    }

    addListing(listing)

    setSuccess('Your pen has been listed successfully! Redirecting to My Listings...')
    setForm(initialForm)
    setImage(null)

    setTimeout(() => navigate('/my-listings'), 1500)
  }

  return (
    <section className="page sell">
      <h1 className="sell__title">Sell a Pen</h1>
      <p className="sell__subtitle">
        List your pen for sale. {user.fullName} ({user.email}) will be the
        seller.
      </p>

      {success && (
        <div className="alert alert--success" role="status">
          {success}
        </div>
      )}

      <form className="form sell__form" onSubmit={handleSubmit} noValidate>
        <div className="form__field">
          <label htmlFor="image">Pen Image</label>
          <div className="sell__image-upload">
            {image ? (
              <img src={image} alt="Pen preview" className="sell__preview" />
            ) : (
              <div className="sell__preview-empty">No image selected</div>
            )}
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          {errors.image && <span className="form__error">{errors.image}</span>}
        </div>

        <div className="form__field">
          <label htmlFor="name">Pen Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Montblanc Meisterstück 149"
          />
          {errors.name && <span className="form__error">{errors.name}</span>}
        </div>

        <div className="form__field">
          <label htmlFor="brand">Brand</label>
          <input
            id="brand"
            name="brand"
            type="text"
            value={form.brand}
            onChange={handleChange}
            placeholder="e.g. Montblanc"
          />
          {errors.brand && <span className="form__error">{errors.brand}</span>}
        </div>

        <div className="form__field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the pen, its condition, and any details..."
          />
          {errors.description && (
            <span className="form__error">{errors.description}</span>
          )}
        </div>

        <div className="sell__row">
          <div className="form__field">
            <label htmlFor="condition">Condition</label>
            <select
              id="condition"
              name="condition"
              value={form.condition}
              onChange={handleChange}
            >
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Used">Used</option>
            </select>
          </div>

          <div className="form__field">
            <label htmlFor="price">Price (USD)</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
            />
            {errors.price && <span className="form__error">{errors.price}</span>}
          </div>
        </div>

        <div className="form__field">
          <label htmlFor="contact">Contact Information</label>
          <input
            id="contact"
            name="contact"
            type="text"
            value={form.contact}
            onChange={handleChange}
            placeholder="e.g. email or phone number"
          />
          {errors.contact && (
            <span className="form__error">{errors.contact}</span>
          )}
        </div>

        <button type="submit" className="btn btn--block">
          List Pen for Sale
        </button>
      </form>
    </section>
  )
}
