import { useState } from 'react'
import { Link } from 'react-router'
import { pens } from '../data/pens'
import { getListings } from '../utils/listingStorage'
import PenCard, { type CardPen } from '../components/PenCard'

const PRICE_RANGES = [
  { value: 'all', label: 'Any Price' },
  { value: 'under-50', label: 'Under $50' },
  { value: '50-100', label: '$50 – $100' },
  { value: '100-250', label: '$100 – $250' },
  { value: 'over-250', label: 'Over $250' },
]

function matchesPrice(price: number, range: string): boolean {
  switch (range) {
    case 'under-50':
      return price < 50
    case '50-100':
      return price >= 50 && price <= 100
    case '100-250':
      return price > 100 && price <= 250
    case 'over-250':
      return price > 250
    default:
      return true
  }
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [condition, setCondition] = useState('all')
  const [priceRange, setPriceRange] = useState('all')

  const listings = getListings()
  const listingsExist = listings.length > 0

  const cardPens: CardPen[] = listingsExist
    ? listings.map((listing) => ({
        id: listing.id,
        name: listing.name,
        brand: listing.brand,
        condition: listing.condition,
        price: listing.price,
        image: listing.image,
        seller: listing.sellerName,
      }))
    : pens.map((pen) => ({
        id: String(pen.id),
        name: pen.name,
        brand: pen.brand,
        condition: pen.condition,
        price: pen.price,
        image: pen.image,
        seller: pen.seller,
      }))

  const conditions = ['all', ...new Set(cardPens.map((p) => p.condition))]

  const q = query.trim().toLowerCase()
  const filteredPens = cardPens.filter((pen) => {
    const matchesQuery =
      !q ||
      pen.name.toLowerCase().includes(q) ||
      pen.brand.toLowerCase().includes(q)
    const matchesCondition = condition === 'all' || pen.condition === condition
    const matchesPriceRange = matchesPrice(pen.price, priceRange)
    return matchesQuery && matchesCondition && matchesPriceRange
  })

  const filteringActive =
    q !== '' || condition !== 'all' || priceRange !== 'all'

  return (
    <>
      <section className="hero">
        <h1 className="hero__title">Buy &amp; Sell Pens</h1>
        <p className="hero__subtitle">
          Discover rare collectibles and list your own premium pens for sale.
        </p>
        <form
          className="search"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="search"
            className="search__input"
            placeholder="Search pens by name or brand..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search__btn">
            Search
          </button>
        </form>
      </section>

      <section className="pen-grid-section">
        <div className="pen-grid__header">
          <h2>{filteringActive ? 'Search Results' : 'Available Pens'}</h2>
          <span className="pen-grid__count">
            {filteredPens.length} available
          </span>
        </div>

        <div className="filters">
          <div className="filters__control">
            <label htmlFor="condition">Condition</label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              {conditions.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Conditions' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="filters__control">
            <label htmlFor="price">Price</label>
            <select
              id="price"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              {PRICE_RANGES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredPens.length > 0 ? (
          <div className="pen-grid">
            {filteredPens.map((pen) => (
              <PenCard key={pen.id} pen={pen} />
            ))}
          </div>
        ) : (
          <div className="pen-grid__empty">
            <p>
              {listingsExist
                ? 'No pens match your search or filters.'
                : 'No pens are available right now.'}
            </p>
            <Link to="/sell" className="btn">
              Be the first to list a pen
            </Link>
          </div>
        )}
      </section>
    </>
  )
}