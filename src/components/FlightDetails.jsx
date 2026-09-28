import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { ChevronDown, X, Wifi, Plug, Utensils, Tv, Luggage, Clock, Plane } from 'lucide-react'
import { formatDuration, formatMoney, formatLongDate } from '../data/flights.js'

const ICONS = { 'Wi-Fi': Wifi, Power: Plug, Meal: Utensils, Snack: Utensils, Entertainment: Tv }

const ease = [0.22, 1, 0.36, 1]

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const headingId = useId()
  const panelId = useId()

  return (
    <div className="border-b border-[#D7EAF8]">
      <button
        type="button"
        id={headingId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3.5 text-left"
      >
        <span className="font-medium">{title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <ChevronDown className="h-4 w-4 text-copy-muted" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={headingId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm leading-relaxed text-copy-muted">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DetailsPanel({ flight, onClose, onSelect }) {
  const closeRef = useRef(null)
  const lenis = useLenis()

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    lenis?.stop()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      lenis?.start()
    }
  }, [lenis])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close details"
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="flight-details-title"
        data-lenis-prevent
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="relative flex h-full w-full max-w-md flex-col bg-paper text-copy shadow-lift"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#D7EAF8] bg-paper/95 px-5 py-4 backdrop-blur">
          <h2 id="flight-details-title" className="font-display text-xl font-semibold">
            Flight details
          </h2>
          <motion.button
            ref={closeRef}
            type="button"
            onClick={onClose}
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.35, ease }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-copy-muted">
              {formatLongDate(flight.date)}
            </p>
            <p className="mt-1 font-display text-2xl font-bold">
              {flight.from.city} → {flight.to.city}
            </p>
            <p className="mt-1 text-sm font-medium text-copy-muted">
              {flight.airline.name} {flight.flightNo}
            </p>

            <div className="mt-6 rounded-2xl bg-white p-4 shadow-card">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="font-display text-2xl font-semibold">{flight.depart}</p>
                  <p className="mt-1 text-xs font-bold text-copy-muted">{flight.from.code}</p>
                  <p className="mt-0.5 text-[11px] text-copy-muted">{flight.from.airport}</p>
                </div>
                <div className="mb-4 flex min-w-[88px] flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-copy-muted">
                    {formatDuration(flight.duration)}
                  </span>
                  <div className="mt-1 flex w-full items-center gap-1">
                    <span className="h-px flex-1 bg-[#B9D8F0]" />
                    <Plane className="h-3.5 w-3.5 text-pine-800" />
                    <span className="h-px flex-1 bg-[#B9D8F0]" />
                  </div>
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-copy-muted">
                    <Clock className="h-3 w-3" />
                    {flight.stops ? `Via ${flight.stopCity}` : 'Nonstop'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-semibold">
                    {flight.arrive}
                    {flight.plusDay && <span className="ml-1 text-xs text-ember-600">+1</span>}
                  </p>
                  <p className="mt-1 text-xs font-bold text-copy-muted">{flight.to.code}</p>
                  <p className="mt-0.5 text-[11px] text-copy-muted">{flight.to.airport}</p>
                </div>
              </div>
              <p className="mt-3 text-xs font-medium text-copy-muted">{flight.aircraft}</p>
            </div>

            <div className="mt-2">
              <Accordion title="Itinerary" defaultOpen>
                Depart {flight.from.airport} ({flight.from.code}) at {flight.depart}. Arrive{' '}
                {flight.to.airport} ({flight.to.code}) at {flight.arrive}
                {flight.plusDay ? ' the next day' : ''}.
                {flight.stops ? ` One connection in ${flight.stopCity}.` : ' Direct routing.'}
              </Accordion>
              <Accordion title="Baggage">
                <span className="inline-flex items-center gap-2">
                  <Luggage className="h-4 w-4 shrink-0" />
                  {flight.baggage}. Extra bags can be added after booking.
                </span>
              </Accordion>
              <Accordion title="Cabin & amenities">
                <p className="mb-2 capitalize">{flight.cabin} cabin</p>
                <div className="flex flex-wrap gap-2">
                  {flight.amenities.map((a) => {
                    const Icon = ICONS[a] || Wifi
                    return (
                      <span
                        key={a}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F1FB] px-3 py-1 text-xs font-medium text-copy"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {a}
                      </span>
                    )
                  })}
                </div>
              </Accordion>
              <Accordion title="Fare rules">
                {flight.fare} fare. Changes permitted with a fee on Standard; Business Flexible
                includes complimentary date changes. Tickets are non-transferable.
              </Accordion>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-[#D7EAF8] bg-paper px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-2xl font-bold text-pine-800">{formatMoney(flight.price)}</p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onSelect}
              className="rounded-md bg-pine-800 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white"
            >
              Continue
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  )
}

export default function FlightDetails({ flight, onClose, onSelect }) {
  return (
    <AnimatePresence>
      {flight && (
        <DetailsPanel key={flight.id} flight={flight} onClose={onClose} onSelect={onSelect} />
      )}
    </AnimatePresence>
  )
}
