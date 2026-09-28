import { motion } from 'framer-motion'
import { useBooking } from '../context/BookingContext.jsx'
import { formatLongDate, formatMoney } from '../data/flights.js'

export default function TripRail() {
  const { selectedFlight, search, paxCount, seats } = useBooking()
  if (!selectedFlight) return null

  return (
    <motion.aside
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      className="h-fit rounded-xl border border-[#D7EAF8] border-l-4 border-l-pine-800 bg-paper p-5 text-copy shadow-card lg:sticky lg:top-24"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-copy-muted">Your trip</p>
      <p className="mt-2 font-display text-xl font-semibold">
        {selectedFlight.from.code} → {selectedFlight.to.code}
      </p>
      <p className="mt-1 text-sm font-medium text-copy-muted">{formatLongDate(selectedFlight.date)}</p>
      <dl className="mt-4 space-y-2 text-sm">
        <Row label="Flight" value={selectedFlight.flightNo} />
        <Row label="Depart" value={selectedFlight.depart} />
        <Row label="Cabin" value={search.cabin} />
        <Row label="Travellers" value={String(paxCount)} />
        {seats.length > 0 && <Row label="Seats" value={seats.join(', ')} />}
      </dl>
      <div className="mt-5 flex items-center justify-between border-t border-[#D7EAF8] pt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-copy-muted">Total</span>
        <span className="font-display text-lg font-bold text-pine-800">
          {formatMoney(selectedFlight.price * paxCount)}
        </span>
      </div>
    </motion.aside>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-copy-muted">{label}</dt>
      <dd className="font-medium capitalize">{value}</dd>
    </div>
  )
}
