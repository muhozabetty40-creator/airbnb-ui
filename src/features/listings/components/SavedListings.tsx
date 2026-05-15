import { Transition } from '@headlessui/react'
import { AiFillHeart, AiFillStar } from 'react-icons/ai'
import { MdLocationOn } from 'react-icons/md'
import { IoClose } from 'react-icons/io5'
import numeral from 'numeral'
import { useStore } from '../../../store/StoreContext'
import { useFavorites } from '../hooks/useFavorites'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SavedListings({ open, onClose }: Props) {
  const { state } = useStore()
  const { toggle } = useFavorites()
  const savedListings = state.listings.filter(l => state.saved.includes(l.id))

  return (
    <Transition
      show={open}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 scale-95 translate-y-1"
      enterTo="opacity-100 scale-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 scale-100 translate-y-0"
      leaveTo="opacity-0 scale-95 translate-y-1"
    >
      <div className="fav-panel">
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
                  aria-label="Remove"
                  onClick={() => toggle(l.id, l.title)}
                >
                  <IoClose size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Transition>
  )
}
