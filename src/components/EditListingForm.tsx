import { useState, type FormEvent } from 'react'
import { updateListing, type PenListing } from '../utils/listingStorage'

interface EditListingFormProps {
  listing: PenListing
  onSaved: () => void
  onCancel: () => void
}

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
}

function initialState(listing: PenListing): FormData {
  return {
    name: listing.name,
    brand: listing.brand,
    description: listing.description,
    condition: listing.condition,
    price: String(listing.price),
    contact: listing.sellerContact,
  }
}

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {}

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

export default function EditListingForm({
  listing,
  onSaved,
  onCancel,
}: EditListingFormProps) {
  const [form, setForm] = useState<FormData>(() => initialState(listing))
  const [image, setImage] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

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
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    updateListing(listing.id, {
      name: form.name.trim(),
      brand: form.brand.trim(),
      description: form.description.trim(),
      condition: form.condition,
      price: Number(form.price),
      sellerContact: form.contact.trim(),
      image: image ?? listing.image,
    })

    onSaved()
  }

  return (
    <form className="form edit-form" onSubmit={handleSubmit} noValidate>
      <h3 className="edit-form__title">Edit Listing</h3>

      <div className="form__field">
        <label htmlFor={`edit-image-${listing.id}`}>Pen Image</label>
        <div className="sell__image-upload">
          <img
            src={image ?? listing.image}
            alt={form.name || listing.name}
            className="sell__preview"
          />
          <input
            id={`edit-image-${listing.id}`}
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      </div>

      <div className="form__field">
        <label htmlFor={`edit-name-${listing.id}`}>Pen Name</label>
        <input
          id={`edit-name-${listing.id}`}
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <span className="form__error">{errors.name}</span>}
      </div>

      <div className="form__field">
        <label htmlFor={`edit-brand-${listing.id}`}>Brand</label>
        <input
          id={`edit-brand-${listing.id}`}
          name="brand"
          type="text"
          value={form.brand}
          onChange={handleChange}
        />
        {errors.brand && <span className="form__error">{errors.brand}</span>}
      </div>

      <div className="form__field">
        <label htmlFor={`edit-description-${listing.id}`}>Description</label>
        <textarea
          id={`edit-description-${listing.id}`}
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
        />
        {errors.description && (
          <span className="form__error">{errors.description}</span>
        )}
      </div>

      <div className="sell__row">
        <div className="form__field">
          <label htmlFor={`edit-condition-${listing.id}`}>Condition</label>
          <select
            id={`edit-condition-${listing.id}`}
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
          <label htmlFor={`edit-price-${listing.id}`}>Price (USD)</label>
          <input
            id={`edit-price-${listing.id}`}
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
          />
          {errors.price && <span className="form__error">{errors.price}</span>}
        </div>
      </div>

      <div className="form__field">
        <label htmlFor={`edit-contact-${listing.id}`}>Contact Information</label>
        <input
          id={`edit-contact-${listing.id}`}
          name="contact"
          type="text"
          value={form.contact}
          onChange={handleChange}
        />
        {errors.contact && <span className="form__error">{errors.contact}</span>}
      </div>

      <div className="edit-form__actions">
        <button type="submit" className="btn">
          Save Changes
        </button>
        <button
          type="button"
          className="btn btn--alt"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}