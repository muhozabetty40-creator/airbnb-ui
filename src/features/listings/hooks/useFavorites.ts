import toast from 'react-hot-toast'
import { useStore } from '../../../store/StoreContext'

export function useFavorites() {
  const { state, dispatch } = useStore()

  const toggle = (id: number, title: string) => {
    const isSaved = state.saved.includes(id)
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id })
    if (isSaved) {
      toast(`Removed: ${title}`, { icon: '💔' })
    } else {
      toast.success(`Saved: ${title}`)
    }
  }

  const isSaved = (id: number) => state.saved.includes(id)

  return { toggle, count: state.saved.length, isSaved }
}
