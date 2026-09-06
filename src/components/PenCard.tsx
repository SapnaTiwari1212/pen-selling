import { Link } from 'react-router'

export interface CardPen {
  id: string
  name: string
  brand: string
  condition: string
  price: number
  image: string
  seller: string
}

interface PenCardProps {
  pen: CardPen
}

export default function PenCard({ pen }: PenCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(pen.price)

  return (
    <article className="pen-card">
      <div className="pen-card__media">
        <img src={pen.image} alt={pen.name} loading="lazy" />
      </div>
      <div className="pen-card__body">
        <h3 className="pen-card__name">{pen.name}</h3>
        <p className="pen-card__brand">{pen.brand}</p>
        <div className="pen-card__meta">
          <span className={`badge badge--${pen.condition.toLowerCase().replace(/\s+/g, '-')}`}>
            {pen.condition}
          </span>
        </div>
        <p className="pen-card__price">{formattedPrice}</p>
        <p className="pen-card__seller">Seller: {pen.seller}</p>
        <Link to={`/pens/${pen.id}`} className="btn btn--block">
          View Details
        </Link>
      </div>
    </article>
  )
}