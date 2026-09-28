import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

const WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const monthSlide = {
  enter: (d) => ({ x: d * 56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d * -56, opacity: 0 }),
}

function toIso(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function daysInGrid(monthDate) {
  const start = startOfMonth(monthDate)
  const offset = start.getDay()
  const days = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < offset; i += 1) cells.push(null)
  for (let d = 1; d <= days; d += 1) {
    cells.push(new Date(start.getFullYear(), start.getMonth(), d))
  }
  return cells
}

export default function DatePicker({ label, value, onChange, min, error }) {
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(() => (value ? new Date(`${value}T12:00:00`) : new Date()))
  const [dir, setDir] = useState(1)
  const wrapRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    if (open && value) setCursor(new Date(`${value}T12:00:00`))
  }, [open, value])

  const cells = useMemo(() => daysInGrid(cursor), [cursor])
  const today = toIso(new Date())
  const minDate = min || today
  const title = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const display = value
    ? new Date(`${value}T12:00:00`).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : 'Pick a date'

  const shift = (n) => {
    setDir(n)
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + n, 1))
  }

  return (
    <div ref={wrapRef} className={`relative ${open ? 'z-50' : 'z-10'}`}>
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-copy-muted">
        {label}
      </p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center gap-3 rounded-lg border bg-white px-3.5 py-3 text-left text-copy transition ${
          error
            ? 'border-ember-500 ring-2 ring-ember-500/20'
            : open
              ? 'border-pine-600 ring-2 ring-pine-500/20'
              : 'border-[#D7EAF8] hover:border-pine-800'
        }`}
      >
        <CalendarDays className="h-4 w-4 text-pine-800" />
        <span>
          <span className="block font-display text-lg font-semibold leading-none text-copy">
            {display}
          </span>
          <span className="mt-1 block text-xs font-medium text-copy-muted">Travel date</span>
        </span>
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
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-50 mt-2 w-[min(100vw-2rem,320px)] overflow-hidden rounded-lg border border-[#D7EAF8] bg-white p-4 text-copy shadow-lift"
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => shift(-1)}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-[#E8F3FB]"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="font-display text-sm font-semibold">{title}</p>
              <button
                type="button"
                onClick={() => shift(1)}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-[#E8F3FB]"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-copy-muted">
              {WEEK.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="relative mt-1 overflow-hidden">
              <AnimatePresence mode="wait" initial={false} custom={dir}>
                <motion.div
                  key={title}
                  custom={dir}
                  variants={monthSlide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-7 gap-1"
                >
                  {cells.map((day, i) => {
                    if (!day) return <span key={`e-${i}`} />
                    const iso = toIso(day)
                    const disabled = iso < minDate
                    const selected = iso === value
                    const isToday = iso === today
                    return (
                      <button
                        key={iso}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          onChange(iso)
                          setOpen(false)
                        }}
                        className={`h-9 rounded-xl text-sm transition ${
                          selected
                            ? 'bg-pine-800 font-semibold text-white'
                            : disabled
                              ? 'cursor-not-allowed text-[#B0A8A0]'
                              : isToday
                                ? 'bg-[#E8F3FB] font-semibold text-pine-800'
                                : 'hover:bg-[#E8F3FB]'
                        }`}
                      >
                        {day.getDate()}
                      </button>
                    )
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
