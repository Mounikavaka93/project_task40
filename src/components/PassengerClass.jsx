import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Minus, Plus, Users } from 'lucide-react'
import { CABINS } from '../data/cities.js'

function Stepper({ label, value, min, max, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm font-medium text-copy">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="grid h-8 w-8 place-items-center rounded-full border border-[#D7EAF8] text-copy disabled:opacity-30"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <motion.span
          key={value}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-5 text-center font-display text-sm font-semibold"
        >
          {value}
        </motion.span>
        <button
          type="button"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="grid h-8 w-8 place-items-center rounded-full border border-[#D7EAF8] text-copy disabled:opacity-30"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export default function PassengerClass({ search, onChange, error }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const total = search.adults + search.children
  const cabin = CABINS.find((c) => c.id === search.cabin)

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div ref={wrapRef} className={`relative ${open ? 'z-50' : 'z-10'}`}>
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-copy-muted">
        Travellers & class
      </p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center gap-3 rounded-lg border bg-white px-3.5 py-3 text-left text-copy transition ${
          error
            ? 'border-ember-500 ring-2 ring-ember-500/20'
            : open
              ? 'border-pine-600 ring-2 ring-pine-500/20'
              : 'border-[#D7EAF8] hover:border-copy'
        }`}
      >
        <span className="flex items-center gap-3">
          <Users className="h-4 w-4 text-pine-800" />
          <span>
            <span className="block font-display text-lg font-semibold leading-none text-copy">
              {total} {total === 1 ? 'traveller' : 'travellers'}
            </span>
            <span className="mt-1 block text-xs font-medium text-copy-muted">{cabin?.label}</span>
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="text-copy-muted"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden text-xs font-bold text-ember-600"
          >
            <span className="mt-1.5 block">{error}</span>
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-[#D7EAF8] bg-white text-copy shadow-lift"
          >
            <div className="p-4">
              <Stepper
                label="Adults"
                value={search.adults}
                min={1}
                max={6}
                onChange={(v) => onChange({ ...search, adults: v })}
              />
              <Stepper
                label="Children"
                value={search.children}
                min={0}
                max={4}
                onChange={(v) => onChange({ ...search, children: v })}
              />
              <p className="mb-2 mt-3 text-[11px] font-bold uppercase tracking-wider text-copy-muted">
                Cabin
              </p>
              <div className="grid gap-2">
                {CABINS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onChange({ ...search, cabin: c.id })}
                    className={`rounded-xl border px-3 py-2 text-left transition ${
                      search.cabin === c.id
                        ? 'border-pine-600 bg-pine-800 text-white'
                        : 'border-[#D7EAF8] text-copy hover:border-copy'
                    }`}
                  >
                    <span className="block text-sm font-medium">{c.label}</span>
                    <span
                      className={`text-xs ${search.cabin === c.id ? 'text-white/80' : 'text-copy-muted'}`}
                    >
                      {c.note}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
