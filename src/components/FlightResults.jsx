import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowUpDown, SlidersHorizontal } from 'lucide-react'
import { searchFlights, formatLongDate } from '../data/flights.js'
import { useBooking } from '../context/BookingContext.jsx'
import FlightCard, { FlightSkeleton } from './FlightCard.jsx'
import Filters from './Filters.jsx'
import FlightDetails from './FlightDetails.jsx'

function bucket(depart) {
  const h = Number(depart.slice(0, 2))
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
}

const SORTS = [
  { id: 'price', label: 'Cheapest' },
  { id: 'duration', label: 'Fastest' },
  { id: 'depart', label: 'Earliest' },
]

export default function FlightResults() {
  const { search, setView, setSelectedFlight, paxCount } = useBooking()
  const from = search.from
  const to = search.to

  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('price')
  const [detailFlight, setDetailFlight] = useState(null)
  const [mobileFilters, setMobileFilters] = useState(false)

  const all = useMemo(
    () =>
      from && to
        ? searchFlights({ from, to, date: search.date, cabin: search.cabin })
        : [],
    [from, to, search.date, search.cabin],
  )

  const maxPrice = useMemo(
    () => (all.length ? Math.max(...all.map((f) => f.price)) : 800),
    [all],
  )
  const [filters, setFilters] = useState({ price: maxPrice, airlines: [], times: [], stops: 'any' })

  useEffect(() => {
    setFilters((f) => ({ ...f, price: maxPrice }))
  }, [maxPrice])

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 1100)
    return () => clearTimeout(t)
  }, [search.from, search.to, search.date, search.cabin])

  const shown = useMemo(() => {
    let list = all.filter((f) => f.price <= filters.price)
    if (filters.airlines.length) list = list.filter((f) => filters.airlines.includes(f.airline.id))
    if (filters.times.length) list = list.filter((f) => filters.times.includes(bucket(f.depart)))
    if (filters.stops !== 'any') list = list.filter((f) => String(f.stops) === filters.stops)
    list = [...list].sort((a, b) => {
      if (sort === 'price') return a.price - b.price
      if (sort === 'duration') return a.duration - b.duration
      return a.depart.localeCompare(b.depart)
    })
    return list
  }, [all, filters, sort])

  const pick = (flight) => {
    setSelectedFlight(flight)
    setView('passengers')
  }

  return (
    <section className="page w-full py-8">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-pine-800">Results</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-pine-900">
          {from?.city || 'Departure'} → {to?.city || 'Arrival'}
        </h1>
        <p className="mt-1 text-sm font-medium text-pine-800">
          {formatLongDate(search.date)} · {paxCount} traveller{paxCount > 1 ? 's' : ''} · {search.cabin}
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="justify-self-start">
          <button
            type="button"
            onClick={() => setMobileFilters(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#003DA5] px-3 py-1.5 text-xs font-bold text-white lg:hidden"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </button>
        </div>
        <LayoutGroup id="sort">
          <div className="flex items-center justify-center gap-1 justify-self-center rounded-full border border-[#D7EAF8] bg-white p-1 text-copy">
            <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-copy-muted" />
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSort(s.id)}
                className="relative rounded-full px-3 py-1.5 text-xs font-bold"
              >
                {sort === s.id && (
                  <motion.span
                    layoutId="sortPill"
                    className="absolute inset-0 rounded-full bg-pine-800 shadow-card"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${sort === s.id ? 'text-white' : 'text-copy'}`}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </LayoutGroup>
        <p className="justify-self-end text-xs font-medium text-pine-800">
          {loading ? 'Scanning routes…' : `${shown.length} flights`}
        </p>
      </div>

      <div className="grid w-full gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <Filters
            filters={filters}
            setFilters={setFilters}
            maxPrice={maxPrice}
            airlinesPresent={[...new Set(all.map((f) => f.airline.id))]}
            uid="desk"
          />
        </div>

        <div className="min-h-[320px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeletons"
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <FlightSkeleton key={i} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                <LayoutGroup>
                  <AnimatePresence mode="popLayout">
                    {shown.length === 0 && (
                      <motion.p
                        key="empty"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl border border-dashed border-pine-800/30 bg-white/50 p-10 text-center text-sm font-medium text-pine-800"
                      >
                        No flights match those filters. Loosen price or time.
                      </motion.p>
                    )}
                    {shown.map((flight, i) => (
                      <FlightCard
                        key={flight.id}
                        flight={flight}
                        index={i}
                        onSelect={() => pick(flight)}
                        onDetails={() => setDetailFlight(flight)}
                      />
                    ))}
                  </AnimatePresence>
                </LayoutGroup>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {mobileFilters && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/70"
              onClick={() => setMobileFilters(false)}
              aria-label="Close filters"
            />
            <motion.div
              initial={{ y: 48 }}
              animate={{ y: 0 }}
              exit={{ y: 48 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-auto rounded-t-3xl bg-paper p-4 text-copy"
            >
              <Filters
                filters={filters}
                setFilters={setFilters}
                maxPrice={maxPrice}
                airlinesPresent={[...new Set(all.map((f) => f.airline.id))]}
                uid="mobile"
              />
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="mt-4 w-full rounded-md bg-pine-800 py-3 text-sm font-bold uppercase tracking-wide text-white"
              >
                Show flights
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FlightDetails
        flight={detailFlight}
        onClose={() => setDetailFlight(null)}
        onSelect={() => {
          pick(detailFlight)
          setDetailFlight(null)
        }}
      />
    </section>
  )
}
