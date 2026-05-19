import toast from 'react-hot-toast'
import { useStore } from '../../../store/StoreContext'
import type { ApiListing } from '../../../store/types'

export function useFavorites() {
  const { state, dispatch } = useStore()

  const toggle = (id: number, title: string) => {
    const isSaved = state.saved.includes(id)
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id })
    toast(isSaved ? `Removed: ${title}` : `Saved: ${title}`, { icon: isSaved ? '💔' : '❤️' })
  }

  const toggleApi = (listing: ApiListing) => {
    const isSaved = state.savedApiListings.some(l => l.id === listing.id)
    dispatch({ type: 'TOGGLE_API_FAVORITE', payload: listing })
    toast(isSaved ? `Removed: ${listing.title}` : `Saved: ${listing.title}`, { icon: isSaved ? '💔' : '❤️' })
  }

  const isSaved = (id: number) => state.saved.includes(id)
  const isApiSaved = (id: string) => state.savedApiListings.some(l => l.id === id)

  return { toggle, toggleApi, count: state.savedApiListings.length, isSaved, isApiSaved }
}
