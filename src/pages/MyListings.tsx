import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import {
  deleteListing,
  getListingsBySeller,
  type PenListing,
} from '../utils/listingStorage'
import EditListingForm from '../components/EditListingForm'

export default function MyListings() {
  const { user } = useAuth()
  const [listings, setListings] = useState<PenListing[]>(() =>
    user ? getListingsBySeller(user.id) : [],
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const notify = (text: string) => {
    setNotice(text)
    window.setTimeout(() => setNotice(null), 3000)
  }

  const refreshListings = () => {
    setListings(getListingsBySeller(user.id))
  }

  const handleDelete = (listing: PenListing) => {
    const confirmed = window.confirm(
      `Delete "${listing.name}" from your listings?`,
    )
    if (!confirmed) return

    deleteListing(listing.id)
    if (editingId === listing.id) {
      setEditingId(null)
    }
    refreshListings()
    notify('Listing deleted.')
  }

  const handleSaved = () => {
    setEditingId(null)
    refreshListings()
    notify('Listing updated successfully.')
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  return (
    <section className="page">
      <div className="pen-grid__header">
        <h1>My Listings</h1>
        <Link to="/sell" className="btn">
          Sell a Pen
        </Link>
      </div>

      {notice && (
        <div className="alert alert--success" role="status">
          {notice}
        </div>
      )}

      {listings.length === 0 ? (
        <div className="listings__empty">
          <p>You don&apos;t have any listings yet.</p>
          <Link to="/sell" className="btn">
            List your first pen!
          </Link>
        </div>
      ) : (
        <div className="listings">
          {listings.map((listing) => (
            <div key={listing.id}>
              {editingId === listing.id ? (
                <div className="edit-wrap">
                  <EditListingForm
                    listing={listing}
                    onSaved={handleSaved}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <article className="listing-card">
                  <div className="listing-card__media">
                    <img src={listing.image} alt={listing.name} />
                  </div>
                  <div className="listing-card__body">
                    <h2 className="listing-card__name">{listing.name}</h2>
                    <p className="listing-card__brand">{listing.brand}</p>
                    <p className="listing-card__desc">{listing.description}</p>
                    <span className={`badge badge--${listing.condition.toLowerCase().replace(/\s+/g, '-')}`}>
                      {listing.condition}
                    </span>
                    <p className="listing-card__price">
                      {formatPrice(listing.price)}
                    </p>
                    <p className="listing-card__meta">
                      Contact: {listing.sellerContact} &middot; Listed{' '}
                      {formatDate(listing.createdAt)}
                    </p>
                    <div className="listing-card__actions">
                      <button
                        type="button"
                        className="btn btn--sm"
                        onClick={() => setEditingId(listing.id)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn--sm btn--danger"
                        onClick={() => handleDelete(listing)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}