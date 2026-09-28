import { motion } from 'framer-motion'
import { useBooking } from '../context/BookingContext.jsx'
import { formatLongDate, formatMoney } from '../data/flights.js'

const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  angle: (i / 14) * Math.PI * 2,
  dist: 56 + (i % 4) * 18,
  delay: i * 0.03,
}))

export default function Confirmation() {
  const { selectedFlight, passengers, seats, contact, bookingRef, paxCount, reset } = useBooking()
  if (!selectedFlight) return null
  const total = selectedFlight.price * paxCount

  return (
    <section className="page relative w-full overflow-hidden py-12">
      <div className="flex flex-col items-center text-center">
        <div className="relative grid h-20 w-20 place-items-center">
          {SPARKS.map((s) => (
            <motion.span
              key={s.id}
              className="absolute h-2 w-2 rounded-full bg-pine-400"
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
              animate={{
                x: Math.cos(s.angle) * s.dist,
                y: Math.sin(s.angle) * s.dist,
                opacity: 0,
                scale: 1,
              }}
              transition={{ duration: 0.85, delay: 0.15 + s.delay, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="grid h-20 w-20 place-items-center rounded-md bg-pine-800"
          >
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-pine-400"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.55, opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            />
            <svg viewBox="0 0 52 52" className="h-10 w-10">
              <motion.path
                d="M14 27 L22 35 L38 17"
                fill="none"
                stroke="#F4EDE1"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              />
            </svg>
          </motion.div>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 font-display text-3xl font-bold text-pine-900"
        >
          You’re booked.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-2 text-sm font-medium text-pine-800"
        >
          Confirmation sent to {contact.email}
        </motion.p>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 40, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.45, type: 'spring', stiffness: 120, damping: 18 }}
        className="relative mt-10 w-full overflow-hidden rounded-xl border border-[#D7EAF8] bg-paper text-copy shadow-lift"
      >
        <div className="absolute left-0 right-0 top-[5.5rem] flex justify-between">
          <span className="h-6 w-6 -translate-x-1/2 rounded-full bg-sand-50" />
          <span className="h-6 w-6 translate-x-1/2 rounded-full bg-sand-50" />
        </div>
        <div className="bg-pine-800 px-6 py-5 text-white sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-pine-400">Boarding pass</p>
              <p className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                {selectedFlight.from.code} → {selectedFlight.to.code}
              </p>
            </div>
            <p className="font-mono text-sm">{bookingRef}</p>
          </div>
        </div>
        <div className="grid gap-4 px-6 py-6 sm:grid-cols-3 sm:px-8 lg:grid-cols-6">
          <Info label="Flight" value={selectedFlight.flightNo} />
          <Info label="Date" value={formatLongDate(selectedFlight.date)} />
          <Info label="Depart" value={selectedFlight.depart} />
          <Info label="Arrive" value={selectedFlight.arrive} />
          <Info label="Cabin" value={selectedFlight.cabin} />
          <Info label="Seats" value={seats.join(', ')} />
        </div>
        <div className="border-t border-dashed border-[#D7EAF8] px-6 py-4 sm:px-8">
          {passengers.map((p, i) => (
            <p key={p.id} className="flex justify-between text-sm">
              <span>
                {p.first} {p.last}
              </span>
              <span className="text-copy-muted">{seats[i]}</span>
            </p>
          ))}
          <p className="mt-3 flex justify-between font-display text-lg font-semibold">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </p>
        </div>
      </motion.article>

      <div className="mt-8 flex justify-center">
        <motion.button
          type="button"
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={reset}
          className="shine rounded-md bg-pine-800 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white"
        >
          Book another flight
        </motion.button>
      </div>
    </section>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-copy-muted">{label}</p>
      <p className="mt-0.5 font-medium capitalize">{value}</p>
    </div>
  )
}
