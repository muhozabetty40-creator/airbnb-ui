import { IoArrowForward, IoChevronBack, IoChevronForward } from 'react-icons/io5'
import ListingCard, { type Listing } from './ListingCard'

const homes: Listing[] = [
  { id: 1, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80', badge: 'Guest favorite', title: 'Apartment in Nairobi', price: 63, nights: 2, rating: 5.0 },
  { id: 2, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80', badge: 'Guest favorite', title: 'Apartment in Kilimani Estate', price: 56, nights: 2, rating: 4.92 },
  { id: 3, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80', badge: 'Guest favorite', title: 'Apartment in Nairobi', price: 51, nights: 2, rating: 4.97 },
  { id: 4, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80', badge: 'Guest favorite', title: 'Room in Nairobi', price: 47, nights: 2, rating: 4.95 },
  { id: 5, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80', badge: 'Guest favorite', title: 'Apartment in Nairobi', price: 58, nights: 2, rating: 4.99 },
  { id: 6, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80', badge: 'Superhost', title: 'Place to stay in Nairobi', price: 44, nights: 2, rating: 5.0 },
  { id: 7, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80', badge: 'Guest favorite', title: 'Apartment in Nairobi', price: 85, nights: 2, rating: 5.0 },
]

const hotels: Listing[] = [
  { id: 8, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80', title: 'Rockwell East', price: 408, nights: 2, rating: 4.81 },
  { id: 9, image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=80', title: 'Grange Buckingham', price: 415, nights: 2, rating: 4.79 },
  { id: 10, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80', title: 'Roomzzz Aparthotel London Stratford', price: 366, nights: 2, rating: 4.86 },
  { id: 11, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80', title: 'Gem Strathmore Hotel', price: 367, nights: 2, rating: 4.53 },
  { id: 12, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80', title: 'Fraser Place Canary Wharf', price: 368, nights: 2, rating: 4.6 },
  { id: 13, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80', title: '54 Queens Gate', price: 577, nights: 2, rating: 5.0 },
  { id: 14, image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&q=80', title: 'The Red Lion Hotel Leytonstone', price: 425, nights: 2, rating: 5.0 },
]

interface SectionProps {
  title: string
  subtitle?: string
  listings: Listing[]
}

function Section({ title, subtitle, listings }: SectionProps) {
  return (
    <section className="listings-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            {title}
            <button type="button" className="section-arrow" aria-label="See all">
              <IoArrowForward size={16} />
            </button>
          </h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        <div className="section-nav">
          <button type="button" className="nav-btn" aria-label="Previous"><IoChevronBack size={16} /></button>
          <button type="button" className="nav-btn" aria-label="Next"><IoChevronForward size={16} /></button>
        </div>
      </div>

      <div className="cards-row">
        {listings.map(l => <ListingCard key={l.id} listing={l} />)}
      </div>
    </section>
  )
}

export default function ListingsPage() {
  return (
    <main className="listings-page">
      <Section title="Popular homes in Nairobi" listings={homes} />
      <Section
        title="Great deals on hotels"
        subtitle="Plus, get Airbnb credit when you stay at a featured hotel."
        listings={hotels}
      />
    </main>
  )
}
