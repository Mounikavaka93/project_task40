import { createContext, useContext, useMemo, useState } from 'react'
import { CITIES } from '../data/cities.js'
import { searchFlights } from '../data/flights.js'

const BookingContext = createContext(null)

const todayIso = () => new Date().toISOString().slice(0, 10)

const initialSearch = {
  trip: 'oneway',
  from: null,
  to: null,
  date: todayIso(),
  returnDate: '',
  adults: 1,
  children: 0,
  cabin: 'economy',
}

function demoPassengers(adults, children) {
  const list = []
  for (let i = 0; i < adults; i += 1) {
    list.push({
      id: i,
      first: i === 0 ? 'Alex' : 'Sam',
      last: 'Rivers',
      dob: '1992-04-12',
      passport: `AB123456${i}`,
      type: 'Adult',
    })
  }
  for (let i = 0; i < children; i += 1) {
    list.push({
      id: adults + i,
      first: 'Noa',
      last: 'Rivers',
      dob: '2016-08-03',
      passport: `CH765432${i}`,
      type: 'Child',
    })
  }
  return list
}

export function BookingProvider({ children }) {
  const [view, setView] = useState('search')
  const [search, setSearch] = useState(initialSearch)
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [passengers, setPassengers] = useState([])
  const [contact, setContact] = useState({ email: '', phone: '' })
  const [seats, setSeats] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [bookingRef, setBookingRef] = useState('')

  const paxCount = search.adults + search.children

  const goTo = (id) => {
    if (id === view) return

    const nextSearch = {
      ...search,
      from: search.from || CITIES[0],
      to: search.to || CITIES[1],
    }
    if (!search.from || !search.to) setSearch(nextSearch)

    const needsFlight = ['passengers', 'seats', 'payment', 'confirm'].includes(id)
    let flight = selectedFlight
    if (needsFlight && !flight) {
      const found = searchFlights({
        from: nextSearch.from,
        to: nextSearch.to,
        date: nextSearch.date,
        cabin: nextSearch.cabin,
      })
      flight = found[0]
      setSelectedFlight(flight)
    }

    const count = nextSearch.adults + nextSearch.children
    const needsTravellers = ['seats', 'payment', 'confirm'].includes(id)
    if (needsTravellers && passengers.length !== count) {
      setPassengers(demoPassengers(nextSearch.adults, nextSearch.children))
    }

    if (['payment', 'confirm'].includes(id) && seats.length !== count) {
      setSeats(Array.from({ length: count }, (_, i) => `${i + 3}C`))
    }

    if ((id === 'payment' || id === 'confirm') && !contact.email) {
      setContact({ email: 'alex.rivers@email.com', phone: '+1 555 0142' })
    }

    if (id === 'confirm' && !bookingRef) {
      setBookingRef('QYTHORN7')
    }

    setView(id)
  }

  const value = useMemo(
    () => ({
      view,
      setView,
      goTo,
      search,
      setSearch,
      selectedFlight,
      setSelectedFlight,
      passengers,
      setPassengers,
      contact,
      setContact,
      seats,
      setSeats,
      paymentMethod,
      setPaymentMethod,
      bookingRef,
      setBookingRef,
      paxCount,
      reset: () => {
        setView('search')
        setSearch(initialSearch)
        setSelectedFlight(null)
        setPassengers([])
        setContact({ email: '', phone: '' })
        setSeats([])
        setPaymentMethod('card')
        setBookingRef('')
      },
    }),
    [view, search, selectedFlight, passengers, contact, seats, paymentMethod, bookingRef, paxCount],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
