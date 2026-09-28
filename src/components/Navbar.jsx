import { motion } from 'framer-motion'
import { Plane } from 'lucide-react'
import { useBooking } from '../context/BookingContext.jsx'

const STEPS = [
  { id: 'search', label: 'Search' },
  { id: 'results', label: 'Flights' },
  { id: 'passengers', label: 'Travellers' },
  { id: 'seats', label: 'Seats' },
  { id: 'payment', label: 'Pay' },
  { id: 'confirm', label: 'Ticket' },
]

export default function Navbar() {
  const { view, goTo, reset } = useBooking()
  const idx = Math.max(0, STEPS.findIndex((s) => s.id === view))

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D7EAF8] bg-white pointer-events-auto shadow-card">
      <div className="page relative z-50 flex items-center justify-between gap-3 py-3">
        <button
          type="button"
          onClick={reset}
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="Quaythorn home"
        >
          <motion.span
            animate={{ y: [0, -2, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            className="grid h-9 w-9 place-items-center rounded-md bg-pine-800 text-white"
          >
            <Plane className="h-4 w-4" strokeWidth={2.4} />
          </motion.span>
          <span className="font-display text-xl italic tracking-tight text-pine-800">
            Quaythorn
          </span>
        </button>

        <nav
          className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto px-1"
          aria-label="Booking steps"
        >
          {STEPS.map((step, i) => {
            const current = step.id === view
            const done = i < idx

            return (
              <div key={step.id} className="flex shrink-0 items-center">
                {i > 0 && (
                  <span
                    className={`mx-0.5 hidden h-px w-3 sm:mx-1 sm:block sm:w-4 ${
                      done || current ? 'bg-pine-800' : 'bg-[#D7EAF8]'
                    }`}
                  />
                )}
                <button
                  type="button"
                  onClick={() => goTo(step.id)}
                  aria-current={current ? 'page' : undefined}
                  className={`relative cursor-pointer rounded-md px-2.5 py-2 text-xs font-extrabold uppercase tracking-wide sm:px-3 sm:text-sm ${
                    current
                      ? 'bg-pine-800 text-white shadow-card'
                      : done
                        ? 'bg-[#E8F3FB] text-pine-800'
                        : 'text-pine-800 hover:bg-[#E8F3FB]'
                  }`}
                >
                  {step.label}
                </button>
              </div>
            )
          })}
        </nav>

        <div className="shrink-0">
          {view !== 'search' ? (
            <motion.button
              type="button"
              onClick={reset}
              className="cursor-pointer rounded-md border border-pine-800 px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-pine-800 hover:bg-pine-800 hover:text-white"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              New search
            </motion.button>
          ) : (
            <span className="invisible hidden rounded-md px-3 py-1.5 text-xs sm:inline">
              New search
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
