export interface PenListing {
  id: string
  sellerId: string
  sellerName: string
  sellerContact: string
  name: string
  brand: string
  description: string
  condition: 'New' | 'Like New' | 'Used'
  price: number
  image: string
  createdAt: string
}

const LISTINGS_KEY = 'penmart_listings'

export function getListings(): PenListing[] {
  try {
    const raw = localStorage.getItem(LISTINGS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getListingsBySeller(sellerId: string): PenListing[] {
  return getListings()
    .filter((l) => l.sellerId === sellerId)
    .reverse()
}

export function addListing(listing: PenListing): void {
  const listings = getListings()
  listings.push(listing)
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings))
}

export function updateListing(
  id: string,
  updates: Partial<Omit<PenListing, 'id' | 'sellerId' | 'createdAt'>>,
): void {
  const listings = getListings()
  const updated = listings.map((l) =>
    l.id === id ? { ...l, ...updates } : l,
  )
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(updated))
}

export function deleteListing(id: string): void {
  const listings = getListings().filter((l) => l.id !== id)
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings))
}
