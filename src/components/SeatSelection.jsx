import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useBooking } from '../context/BookingContext.jsx'
import TripRail from './TripRail.jsx'

const COLS = ['A', 'B', 'C', 'D', 'E', 'F']
const ROWS = 12

function seatId(row, col) {
  return `${row}${col}`
}

function buildOccupied(flightId) {
  const taken = new Set()
  let n = [...flightId].reduce((a, c) => a + c.charCodeAt(0), 0)
  for (let i = 0; i < 28; i += 1) {
    n = (n * 1103515245 + 12345) & 0x7fffffff
    const row = 1 + (n % ROWS)
    const col = COLS[n % 6]
    taken.add(seatId(row, col))
  }
  return taken
}

export default function SeatSelection() {
  const { selectedFlight, passengers, seats, setSeats, setView, paxCount } = useBooking()
  const occupied = useMemo(
    () => (selectedFlight ? buildOccupied(selectedFlight.id) : new Set()),
    [selectedFlight],
  )
  const [hover, setHover] = useState(null)
  const [error, setError] = useState('')

  if (!selectedFlight) return null

  const toggle = (id) => {
    if (occupied.has(id)) return
    setError('')
    setSeats((current) => {
      if (current.includes(id)) return current.filter((s) => s !== id)
      if (current.length >= paxCount) return [...current.slice(1), id]
      return [...current, id]
    })
  }

  const continueOn = () => {
    if (seats.length !== paxCount) {
      setError(`Select ${paxCount} seat${paxCount > 1 ? 's' : ''} to continue`)
      return
    }
    setView('payment')
  }

  return (
    <section className="page w-full py-10">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-pine-800">Cabin</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-pine-900">Choose your seats</h1>
      <p className="mt-2 text-sm text-pine-800">
        {selectedFlight.flightNo} · {paxCount} seat{paxCount > 1 ? 's' : ''} needed · {seats.length}{' '}
        selected
      </p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-pine-900">
            <span className="flex items-center gap-1.5">
              <i className="h-3.5 w-3.5 rounded bg-paper" /> Available
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-3.5 w-3.5 rounded bg-pine-700" /> Selected
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-3.5 w-3.5 rounded bg-ink-200" /> Occupied
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-3.5 w-3.5 rounded border border-ember-500 bg-ember-400/30" /> Extra
              legroom
            </span>
          </div>

          <div className="seat-map mt-6 overflow-x-auto rounded-xl bg-pine-800 p-6 text-white sm:p-8">
            <div className="mx-auto w-[min(100%,360px)]">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-white"
              >
                Nose · {selectedFlight.aircraft}
              </motion.div>
              <div className="mb-2 grid grid-cols-[28px_repeat(3,36px)_16px_repeat(3,36px)] justify-center gap-1 text-center text-[10px] font-bold text-white">
                <span />
                {COLS.slice(0, 3).map((c) => (
                  <span key={c}>{c}</span>
                ))}
                <span />
                {COLS.slice(3).map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
              {Array.from({ length: ROWS }, (_, r) => {
                const row = r + 1
                const extra = row <= 2
                const renderSeat = (col) => {
                  const id = seatId(row, col)
                  const taken = occupied.has(id)
                  const selected = seats.includes(id)
                  const hovered = hover === id
                  return (
                    <motion.button
                      key={id}
                      type="button"
                      disabled={taken}
                      onMouseEnter={() => setHover(id)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => toggle(id)}
                      whileHover={!taken ? { y: -4, scale: 1.08 } : {}}
                      whileTap={!taken ? { scale: 0.9 } : {}}
                      animate={{
                        scale: selected ? 1.16 : 1,
                      }}
                      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                      className={`h-8 w-8 rounded-lg text-[10px] font-semibold ${
                        taken
                          ? 'cursor-not-allowed bg-ink-200 text-ink-400'
                          : selected
                            ? 'bg-pine-500 text-white shadow-lg'
                            : extra
                              ? 'bg-ember-400/40 text-white ring-1 ring-ember-400'
                              : 'bg-paper text-copy'
                      } ${hovered && !taken ? 'ring-2 ring-white/80' : ''}`}
                    >
                      {col}
                    </motion.button>
                  )
                }
                return (
                  <motion.div
                    key={row}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: row * 0.03 }}
                    className="mb-1 grid grid-cols-[28px_repeat(3,36px)_16px_repeat(3,36px)] justify-center gap-1"
                  >
                    <span className="grid place-items-center text-[10px] font-bold text-white">{row}</span>
                    {COLS.slice(0, 3).map(renderSeat)}
                    <span />
                    {COLS.slice(3).map(renderSeat)}
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {seats.map((s, i) => (
                <motion.span
                  key={s}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-full bg-paper px-3 py-1 text-xs font-bold text-copy shadow-card"
                >
                  {passengers[i]?.first || `Traveller ${i + 1}`} · {s}
                </motion.span>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setView('passengers')}
                className="rounded-full border border-pine-800/30 bg-white px-4 py-2.5 text-sm font-medium text-pine-900"
              >
                Back
              </button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={continueOn}
                className="shine rounded-md bg-pine-800 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white"
              >
                Continue to payment
              </motion.button>
            </div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-sm text-ember-600"
            >
              {error}
            </motion.p>
          )}
        </div>
        <TripRail />
      </div>
    </section>
  )
}
