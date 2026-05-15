import { memo } from 'react'
import clsx from 'clsx'
import { format } from 'date-fns'
import numeral from 'numeral'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AiFillHeart, AiOutlineHeart, AiFillStar } from 'react-icons/ai'
import { MdLocationOn } from 'react-icons/md'
import type { Listing } from '../types'
import { useFavorites } from '../hooks/useFavorites'
import styles from './ListingCard.module.css'

interface Props { listing: Listing }

const ListingCard = memo(function ListingCard({ listing }: Props) {
  const { toggle, isSaved } = useFavorites()
  const saved = isSaved(listing.id)

  // Use image field from database, fallback to img for backward compatibility
  const imageUrl = (listing as any).image || (listing as any).img || 'https://via.placeholder.com/280x200?text=No+Image'

  return (
    <motion.div
      className={clsx(styles.card, { [styles.cardSuperhost]: listing.superhost })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Link to={`/listings/${listing.id}`} className={styles.imageWrap}>
        <img src={imageUrl} alt={listing.title} className={styles.image} />
        {listing.superhost && <span className={clsx(styles.badge, styles.badgeSuperhost)}>Superhost</span>}
        {listing.price > 300 && <span className={clsx(styles.badge, styles.badgeLuxury)}>Luxury</span>}
      </Link>

      <button
        type="button"
        className={clsx(styles.heart, { [styles.heartSaved]: saved })}
        aria-label="Save to wishlist"
        onClick={() => toggle(listing.id, listing.title)}
      >
        {saved ? <AiFillHeart size={16} color="#ff385c" /> : <AiOutlineHeart size={16} color="#fff" />}
      </button>

      <div className={styles.info}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{listing.title}</span>
          <span className={styles.rating}><AiFillStar size={12} />{numeral(listing.rating).format('0.00')}</span>
        </div>
        <span className={styles.location}><MdLocationOn size={12} color="#9ca3af" />{listing.location}</span>
        <p className={styles.price}><strong>{numeral(listing.price).format('$0')}</strong> / night</p>
        <div className={styles.meta}>
          <span className={clsx(styles.status, { [styles.statusAvailable]: listing.available, [styles.statusBooked]: !listing.available })}>
            {listing.available ? 'Available' : 'Booked'}
          </span>
          <span className={styles.date}>from {format(new Date(listing.availableFrom), 'MMM d, yyyy')}</span>
        </div>
      </div>
    </motion.div>
  )
})

export default ListingCard
