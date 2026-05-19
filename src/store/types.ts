import type { Listing } from '../features/listings/types'

export interface ApiListing {
  id: string
  title: string
  location: string
  pricePerNight: number
  rating?: number
  image?: string
  type?: string
  guests?: number
  bedrooms?: number
  bathrooms?: number
}

export interface State {
  listings: Listing[]
  loading: boolean
  filter: string
  saved: number[]
  savedApiListings: ApiListing[]
}

export type Action =
  | { type: 'SET_LISTINGS'; payload: Listing[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FILTER'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'TOGGLE_API_FAVORITE'; payload: ApiListing }
  | { type: 'RESET' }
