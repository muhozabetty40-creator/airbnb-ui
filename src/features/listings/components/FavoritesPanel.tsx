import { useEffect, useRef } from 'react'
import { AiFillHeart, AiFillStar } from 'react-icons/ai'
import { MdLocationOn } from 'react-icons/md'
import { IoClose } from 'react-icons/io5'
import numeral from 'numeral'
import { listings } from '../../../data/listings'
import type { Listing } from '../types'

interface Props {
  saved: number[]
  onToggleSave: (id: number) => void
  onClose: () => void
}

export default function FavoritesPanel({ saved, onToggleSave, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const savedListings: Listing[] = listings.filter(l => saved.includes(l.id))

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div className="fav-panel" ref={ref}>
      <div className="fav-panel__header">
        <span className="fav-panel__title">
          <AiFillHeart size={16} color="#ff385c" />
          Saved listings
        </span>
        <button type="button" className="fav-panel__close" onClick={onClose}>
          <IoClose size={18} />
        </button>
      </div>

      {savedListings.length === 0 ? (
        <p className="fav-panel__empty">No saved listings yet. Click ♡ on a card to save.</p>
      ) : (
        <ul className="fav-panel__list">
          {savedListings.map(l => (
            <li key={l.id} className="fav-item">
              <img src={l.img} alt={l.title} className="fav-item__img" />
              <div className="fav-item__info">
                <span className="fav-item__title">{l.title}</span>
                <span className="fav-item__location">
                  <MdLocationOn size={11} /> {l.location}
                </span>
                <span className="fav-item__price">
                  {numeral(l.price).format('$0')}/night
                  <span className="fav-item__rating">
                    <AiFillStar size={11} /> {l.rating.toFixed(2)}
                  </span>
                </span>
              </div>
              <button
                type="button"
                className="fav-item__remove"
                aria-label="Remove from saved"
                onClick={() => onToggleSave(l.id)}
              >
                <IoClose size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
