import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Search } from 'lucide-react'
import { CITIES } from '../data/cities.js'

export default function CitySelect({ label, value, onChange, exclude, error, autoFocus }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef(null)
  const inputRef = useRef(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CITIES.filter((c) => {
      if (exclude && c.code === exclude.code) return false
      if (!q) return true
      return (
        c.city.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
      )
    })
  }, [query, exclude])

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    if (!open) {
      setQuery('')
      return undefined
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 40)
    return () => window.clearTimeout(t)
  }, [open])

  const pick = (city) => {
    onChange(city)
    setQuery('')
    setOpen(false)
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
        <MapPin className="h-4 w-4 shrink-0 text-pine-800" />
        <div className="min-w-0">
          {value ? (
            <motion.p
              layoutId={`city-${value.code}`}
              className="truncate font-display text-lg font-semibold leading-none text-copy"
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
              {value.city}
            </motion.p>
          ) : (
            <p className="truncate font-display text-lg font-semibold leading-none text-copy">
              Select city
            </p>
          )}
          <p className="mt-1 truncate text-xs font-medium text-copy-muted">
            {value ? `${value.code} · ${value.airport}` : 'Airport or destination'}
          </p>
        </div>
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
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-[#D7EAF8] bg-white text-copy shadow-lift"
          >
            <div className="flex items-center gap-2 border-b border-[#D7EAF8] px-3 py-2.5">
              <Search className="h-4 w-4 text-copy-muted" />
              <input
                ref={inputRef}
                autoFocus={autoFocus ?? true}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    e.stopPropagation()
                    if (results[0]) pick(results[0])
                  }
                  if (e.key === 'Escape') setOpen(false)
                }}
                placeholder="Search city or code"
                className="w-full bg-transparent text-sm text-copy outline-none placeholder:text-copy-muted"
              />
            </div>
            <ul className="max-h-64 overflow-auto py-1">
              {results.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-copy-muted">No matches</li>
              )}
              {results.map((city) => (
                <li key={city.code}>
                  <button
                    type="button"
                    onClick={() => pick(city)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-[#E8F3FB]"
                  >
                    <span>
                      <span className="block text-sm font-medium text-copy">{city.city}</span>
                      <span className="text-xs text-copy-muted">
                        {city.airport} · {city.country}
                      </span>
                    </span>
                    <span className="font-display text-sm font-semibold text-pine-800">
                      {city.code}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
