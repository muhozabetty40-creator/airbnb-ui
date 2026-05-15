import { useEffect, useRef, useMemo } from 'react'
import { debounce } from 'lodash'
import { useStore } from '../../../store/StoreContext'

export default function SearchBar() {
  const { dispatch } = useStore()
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => { ref.current?.focus() }, [])

  const debouncedDispatch = useMemo(
    () => debounce((value: string) => dispatch({ type: 'SET_FILTER', payload: value }), 300),
    [dispatch]
  )

  return (
    <input
      ref={ref}
      type="search"
      className="search-bar"
      placeholder="Search by title or location..."
      onChange={e => debouncedDispatch(e.target.value)}
    />
  )
}
