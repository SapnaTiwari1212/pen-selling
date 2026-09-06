export interface Pen {
  id: number
  name: string
  brand: string
  condition: string
  price: number
  image: string
  seller: string
  sellerContact: string
  description: string
}

function penSvg(color: string, accent: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">
      <rect width="320" height="240" fill="#f4f3f6"/>
      <g transform="translate(160 118) rotate(-45)">
        <rect x="-110" y="-9" width="220" height="18" rx="9" fill="${color}"/>
        <polygon points="110,-9 132,-2 132,2 110,9" fill="${accent}"/>
        <path d="M110 -9 L132 -2 L132 2 L110 9 Z" fill="none" stroke="#00000022"/>
        <rect x="-118" y="-4" width="12" height="8" rx="2" fill="#c9c6d0"/>
      </g>
    </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const pens: Pen[] = [
  {
    id: 1,
    name: 'Montblanc Meisterstück 149',
    brand: 'Montblanc',
    condition: 'Like New',
    price: 549,
    image: penSvg('#1f2937', '#9ca3af'),
    seller: 'InkJunkie',
    sellerContact: 'ink.junkie.89@example.com',
    description:
      'Classic Meisterstück 149 with a fine gold nib, smooth piston filler, and near-mint finish. Includes original box.',
  },
  {
    id: 2,
    name: 'Parker Sonnet',
    brand: 'Parker',
    condition: 'Excellent',
    price: 185,
    image: penSvg('#1d4ed8', '#93c5fd'),
    seller: 'VintageInk',
    sellerContact: 'vintage.ink.collector@example.com',
    description:
      'Crafted stainless steel Parker Sonnet with a medium nib. Lightly used, no scratches, writes flawlessly.',
  },
  {
    id: 3,
    name: 'Pilot Metropolitan',
    brand: 'Pilot',
    condition: 'Good',
    price: 28,
    image: penSvg('#b45309', '#fcd34d'),
    seller: 'FountainFan',
    sellerContact: 'fountain.fan.101@example.com',
    description:
      'Reliable everyday writer with a brass body and fine nib. Some wear on the clip but fully functional.',
  },
  {
    id: 4,
    name: 'Lamy Safari',
    brand: 'Lamy',
    condition: 'Good',
    price: 32,
    image: penSvg('#047857', '#6ee7b7'),
    seller: 'InkJunkie',
    sellerContact: 'ink.junkie.89@example.com',
    description:
      'Iconic Lamy Safari in green with a medium nib. A few scuffs, great starter pen, comes with a converter.',
  },
  {
    id: 5,
    name: 'Pelikan Souverän M400',
    brand: 'Pelikan',
    condition: 'Excellent',
    price: 320,
    image: penSvg('#7c2d12', '#fdba74'),
    seller: 'PenCollector',
    sellerContact: 'pen.collector.dave@example.com',
    description:
      'Green-striped Pelikan Souverän M400 with a smooth extra-fine gold nib. Excellent condition, no box.',
  },
  {
    id: 6,
    name: 'Waterman Expert',
    brand: 'Waterman',
    condition: 'Like New',
    price: 98,
    image: penSvg('#4c1d95', '#c4b5fd'),
    seller: 'VintageInk',
    sellerContact: 'vintage.ink.collector@example.com',
    description:
      'Waterman Expert with a purple finish and medium nib. Like new, barely used, includes warranty card.',
  },
]