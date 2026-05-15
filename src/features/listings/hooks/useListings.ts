import { useEffect } from 'react'
import { useStore } from '../../../store/StoreContext'
import { apiService } from '../../../api'

export function useListings() {
  const { dispatch } = useStore()

  useEffect(() => {
    const loadListings = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const response = await apiService.getListings(1, 100)
        dispatch({ type: 'SET_LISTINGS', payload: response.data || [] })
      } catch (error) {
        console.error('Failed to load listings:', error)
        dispatch({ type: 'SET_LISTINGS', payload: [] })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    loadListings()
  }, [dispatch])
}
