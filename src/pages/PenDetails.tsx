import { Link, useParams } from 'react-router'
import { pens } from '../data/pens'
import { getListings } from '../utils/listingStorage'

interface DetailsPen {
  id: string
  name: string
  brand: string
  description: string
  condition: string
  price: number
  image: string
  seller: string
  contact: string
}

function findPen(id: string): DetailsPen | null {
  const listing = getListings().find((l) => l.id === id)
  if (listing) {
    return {
      id: listing.id,
      name: listing.name,
      brand: listing.brand,
      description: listing.description,
      condition: listing.condition,
      price: listing.price,
      image: listing.image,
      seller: listing.sellerName,
      contact: listing.sellerContact,
    }
  }

  const sample = pens.find((p) => String(p.id) === id)
  if (sample) {
    return {
      id: String(sample.id),
      name: sample.name,
      brand: sample.brand,
      description: sample.description,
      condition: sample.condition,
      price: sample.price,
      image: sample.image,
      seller: sample.seller,
      contact: sample.sellerContact,
    }
  }

  return null
}

function contactHref(contact: string): string {
  if (contact.includes('@')) {
    return `mailto:${contact}`
  }
  return `tel:${contact}`
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export default function PenDetails() {
  const { id } = useParams()

  const pen = id ? findPen(id) : null

  if (!pen) {
    return (
      <section className="page not-found">
        <h1>Pen not found</h1>
        <p>The pen you are looking for does not exist or is no longer listed.</p>
        <Link to="/" className="btn">
          Back to Home
        </Link>
      </section>
    )
  }

  return (
    <section className="page pen-details">
      <article className="pen-details__card">
        <div className="pen-details__media">
          <img src={pen.image} alt={pen.name} />
        </div>

        <div className="pen-details__body">
          <h1 className="pen-details__name">{pen.name}</h1>
          <p className="pen-details__brand">{pen.brand}</p>

          <p className="pen-details__desc">{pen.description}</p>

          <div className="pen-details__meta">
            <span
              className={`badge badge--${pen.condition.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {pen.condition}
            </span>
          </div>

          <p className="pen-details__price">{formatPrice(pen.price)}</p>

          <div className="pen-details__seller">
            <p>Seller: {pen.seller}</p>
            <p>Contact: {pen.contact}</p>
          </div>

          <div className="pen-details__actions">
            <Link to="/" className="btn">
              Back to Home
            </Link>
            <a href={contactHref(pen.contact)} className="btn btn--alt">
              Contact Seller
            </a>
          </div>
        </div>
      </article>
    </section>
  )
}