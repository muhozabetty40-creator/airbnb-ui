import { useNavigate } from 'react-router-dom'
import { Transition } from '@headlessui/react'
import { AiFillHeart } from 'react-icons/ai'
import { FaMapMarkerAlt, FaStar, FaTimes } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { useStore } from '../../../store/StoreContext'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SavedListings({ open, onClose }: Props) {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const saved = state.savedApiListings

  const remove = (id: string) =>
    dispatch({ type: 'TOGGLE_API_FAVORITE', payload: saved.find(l => l.id === id)! })

  const goTo = (id: string) => { onClose(); navigate(`/listings/${id}`) }

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
            Saved listings ({saved.length})
          </span>
          <button type="button" className="fav-panel__close" onClick={onClose}>
            <IoClose size={18} />
          </button>
        </div>

        {saved.length === 0 ? (
          <p className="fav-panel__empty">No saved listings yet. Click ♡ on a listing to save it.</p>
        ) : (
          <ul className="fav-panel__list">
            {saved.map(l => (
              <li key={l.id} className="fav-item" style={{ cursor: 'pointer' }} onClick={() => goTo(l.id)}>
                <img
                  src={l.image || 'https://placehold.co/52x52?text=No+Img'}
                  alt={l.title}
                  className="fav-item__img"
                  onError={e => { e.currentTarget.src = 'https://placehold.co/52x52?text=No+Img' }}
                />
                <div className="fav-item__info">
                  <span className="fav-item__title">{l.title}</span>
                  <span className="fav-item__location">
                    <FaMapMarkerAlt size={10} /> {l.location}
                  </span>
                  <span className="fav-item__price">
                    ${l.pricePerNight}/night
                    {l.rating && (
                      <span className="fav-item__rating">
                        <FaStar size={10} color="#f59e0b" /> {l.rating.toFixed(1)}
                      </span>
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  className="fav-item__remove"
                  aria-label="Remove"
                  onClick={e => { e.stopPropagation(); remove(l.id) }}
                >
                  <FaTimes size={13} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Transition>
  )
}
