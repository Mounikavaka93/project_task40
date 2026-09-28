import { LayoutGroup, motion } from 'framer-motion'
import { AIRLINES, formatMoney } from '../data/flights.js'

const TIMES = [
  { id: 'morning', label: 'Morning', hint: '00–12' },
  { id: 'afternoon', label: 'Afternoon', hint: '12–18' },
  { id: 'evening', label: 'Evening', hint: '18–24' },
]

const STOPS = [
  { id: 'any', label: 'Any' },
  { id: '0', label: 'Nonstop' },
  { id: '1', label: '1 stop' },
]

export default function Filters({ filters, setFilters, maxPrice, airlinesPresent, uid = 'desk' }) {
  const toggleAirline = (id) => {
    setFilters((f) => {
      const has = f.airlines.includes(id)
      return {
        ...f,
        airlines: has ? f.airlines.filter((a) => a !== id) : [...f.airlines, id],
      }
    })
  }

  const toggleTime = (id) => {
    setFilters((f) => {
      const has = f.times.includes(id)
      return { ...f, times: has ? f.times.filter((t) => t !== id) : [...f.times, id] }
    })
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="sticky top-24 rounded-xl border border-[#D7EAF8] bg-paper p-5 text-copy shadow-card"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Filters</h2>
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => setFilters({ price: maxPrice, airlines: [], times: [], stops: 'any' })}
          className="text-xs font-bold text-pine-800 hover:underline"
        >
          Reset
        </motion.button>
      </div>

      <div className="space-y-6">
        <div>
          <p className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-copy-muted">
            Max price
            <motion.span
              key={filters.price}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-display text-sm font-semibold normal-case tracking-normal text-pine-800"
            >
              {formatMoney(filters.price)}
            </motion.span>
          </p>
          <div className="mt-4">
            <input
              type="range"
              min={Math.min(80, maxPrice)}
              max={maxPrice}
              value={Math.min(filters.price, maxPrice || filters.price)}
              onChange={(e) => setFilters((f) => ({ ...f, price: Number(e.target.value) }))}
              className="w-full cursor-pointer"
              aria-label="Maximum price"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-copy-muted">Stops</p>
          <LayoutGroup>
            <div className="flex gap-2">
              {STOPS.map((s) => {
                const on = filters.stops === s.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFilters((f) => ({ ...f, stops: s.id }))}
                    className={`relative rounded-full px-3 py-1 text-xs font-medium ${
                      on ? 'text-white' : 'text-copy hover:text-pine-800'
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId={`${uid}-stopPill`}
                        className="absolute inset-0 rounded-full bg-pine-800"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{s.label}</span>
                  </button>
                )
              })}
            </div>
          </LayoutGroup>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-copy-muted">Airline</p>
          <div className="space-y-1.5">
            {AIRLINES.filter((a) => airlinesPresent.includes(a.id)).map((a) => {
              const on = filters.airlines.includes(a.id)
              return (
                <motion.label
                  key={a.id}
                  layout
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    backgroundColor: on ? 'rgba(0, 27, 148, 0.1)' : 'rgba(255,255,255,0)',
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-2 py-1.5"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <motion.span
                      animate={{ scale: on ? 1.25 : 1 }}
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: a.hue }}
                    />
                    {a.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggleAirline(a.id)}
                    className="accent-pine-700"
                  />
                </motion.label>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-copy-muted">
            Departure
          </p>
          <div className="grid gap-2">
              {TIMES.map((t) => {
                const on = filters.times.includes(t.id)
                return (
                  <motion.button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTime(t.id)}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      backgroundColor: on ? '#001B94' : '#FFFFFF',
                      borderColor: on ? '#001B94' : '#D7EAF8',
                      color: on ? '#FFFFFF' : '#1B2430',
                    }}
                    className="rounded-xl border px-3 py-2 text-left text-sm"
                  >
                    <span className="font-medium">{t.label}</span>
                    <span className={`ml-2 text-xs ${on ? 'text-white/80' : 'text-copy-muted'}`}>
                      {t.hint}
                    </span>
                  </motion.button>
                )
              })}
            </div>
        </div>
      </div>
    </motion.aside>
  )
}
