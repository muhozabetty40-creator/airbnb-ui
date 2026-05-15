import { useState } from 'react'
import { AiFillHeart, AiOutlineHeart, AiFillStar } from 'react-icons/ai'

export interface Listing {
  id: number
  image: string
  badge?: string
  title: string
  price: number
  nights: number
  rating: number
}

interface Props {
  listing: Listing
}

export default function ListingCard({ listing }: Props) {
  const [liked, setLiked] = useState(false)

  return (
    <div className="listing-card">
      <div className="card-image-wrap">
        <img src={listing.image} alt={listing.title} className="card-image" />
        {listing.badge && <span className="card-badge">{listing.badge}</span>}
        <button
          type="button"
          className="card-heart"
          aria-label="Save to wishlist"
          onClick={() => setLiked(l => !l)}
        >
          {liked
            ? <AiFillHeart size={18} color="#ff385c" />
            : <AiOutlineHeart size={18} color="#fff" />}
        </button>
      </div>

      <div className="card-info">
        <div className="card-title-row">
          <span className="card-title">{listing.title}</span>
          <span className="card-rating">
            <AiFillStar size={13} />
            {listing.rating.toFixed(2)}
          </span>
        </div>
        <p className="card-price">
          <strong>${listing.price}</strong> for {listing.nights} nights
        </p>
      </div>
    </div>
  )
}
