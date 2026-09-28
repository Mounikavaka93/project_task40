import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useAnimation } from 'framer-motion'
import { ArrowLeftRight, Plane, Search } from 'lucide-react'
import CitySelect from './CitySelect.jsx'
import DatePicker from './DatePicker.jsx'
import PassengerClass from './PassengerClass.jsx'
import { useBooking } from '../context/BookingContext.jsx'
import { CITIES } from '../data/cities.js'
import { fadeUp, stagger } from '../motion.js'

const ROUTES = [
  ['JFK', 'LHR', 'From $428'],
  ['CDG', 'NRT', 'From $790'],
  ['BOM', 'DXB', 'From $186'],
  ['SIN', 'SYD', 'From $310'],
]

const city = (code) => CITIES.find((c) => c.code === code)
const HEADLINE = ['Depart the', 'ordinary.']

export default function SearchSection() {
  const { search, setSearch, setView } = useBooking()
  const [errors, setErrors] = useState({})
  const [swapping, setSwapping] = useState(false)
  const formAnim = useAnimation()

  const swap = () => {
    if (!search.from && !search.to) return
    setSwapping(true)
    setSearch((s) => ({ ...s, from: s.to, to: s.from }))
    setErrors((e) => ({ ...e, from: '', to: '' }))
    window.setTimeout(() => setSwapping(false), 480)
  }

  const validate = () => {
    const next = {}
    if (!search.from) next.from = 'Choose a departure city'
    if (!search.to) next.to = 'Choose an arrival city'
    if (search.from && search.to && search.from.code === search.to.code) {
      next.to = 'Arrival must differ from departure'
    }
    if (!search.date) next.date = 'Select a travel date'
    if (search.trip === 'round' && !search.returnDate) next.returnDate = 'Select a return date'
    if (search.trip === 'round' && search.returnDate && search.returnDate < search.date) {
      next.returnDate = 'Return must be after departure'
    }
    if (search.adults + search.children < 1) next.pax = 'Add at least one traveller'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      await formAnim.start({
        x: [0, -10, 10, -7, 7, 0],
        transition: { duration: 0.42 },
      })
      return
    }
    setView('results')
  }

  return (
    <section className="relative w-full bg-[#E8F4FC] text-copy">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="grain absolute inset-0" />
        <div className="orb absolute -left-24 top-10 h-64 w-64 rounded-full bg-pine-600/10 blur-3xl" />
        <div className="orb orb-slow absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-pine-400/15 blur-3xl" />
        <motion.div
          className="absolute left-[8%] top-20 text-pine-800/30"
          animate={{ x: ['0%', '70%', '100%'], y: [0, -28, 12], rotate: [12, -6, 18] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Plane className="h-8 w-8" />
        </motion.div>
      </div>

      <div className="page relative z-20 grid items-center gap-10 pb-12 pt-10 sm:pb-16 sm:pt-14 lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:pb-20 lg:pt-16">
        <motion.div variants={stagger} initial="initial" animate="animate">
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-semibold uppercase tracking-[0.32em] text-pine-800"
          >
            North Atlantic desk
          </motion.p>
          <h1 className="mt-4 font-display text-5xl italic leading-[0.95] tracking-tight text-pine-900 sm:text-6xl lg:text-7xl">
            {HEADLINE.map((line, li) => (
              <span key={line} className="block overflow-hidden">
                {line.split('').map((ch, i) => (
                  <motion.span
                    key={`${li}-${i}`}
                    className="inline-block"
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.04 * i + li * 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ch === ' ' ? '\u00A0' : ch}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-md text-sm font-medium leading-relaxed text-pine-800"
          >
            Schedules set like type. Cabins kept quiet. A ticket that still looks like a ticket —
            not a dashboard.
          </motion.p>
        </motion.div>

        <LayoutGroup>
          <motion.form
            onSubmit={submit}
            animate={formAnim}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="ticket-edge relative z-20 overflow-visible w-full rounded-xl border border-[#D7EAF8] bg-white p-4 text-copy shadow-lift sm:p-6 lg:p-7"
          >
            <div className="mb-5 flex gap-2">
              {['oneway', 'round'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setSearch((s) => ({ ...s, trip: t }))
                    if (t === 'oneway') setErrors((e) => ({ ...e, returnDate: '' }))
                  }}
                  className={`relative rounded-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                    search.trip === t ? 'text-white' : 'text-copy-muted hover:text-copy'
                  }`}
                >
                  {search.trip === t && (
                    <motion.span
                      layoutId="tripPill"
                      className="absolute inset-0 rounded-md bg-pine-800"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{t === 'oneway' ? 'One way' : 'Round trip'}</span>
                </button>
              ))}
            </div>

            <div className="grid items-end gap-3 md:grid-cols-[1fr_auto_1fr]">
              <motion.div
                animate={{ x: swapping ? 18 : 0, opacity: swapping ? 0.55 : 1 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <CitySelect
                  label="From"
                  value={search.from}
                  exclude={search.to}
                  error={errors.from}
                  onChange={(from) => {
                    setSearch((s) => ({ ...s, from }))
                    setErrors((e) => ({ ...e, from: '' }))
                  }}
                />
              </motion.div>

              <div className="flex items-end justify-center pb-2 md:pb-3">
                <motion.button
                  type="button"
                  onClick={swap}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{ rotate: swapping ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  className="grid h-12 w-12 place-items-center rounded-md border border-[#D7EAF8] bg-white text-pine-800 shadow-card hover:border-pine-800"
                  aria-label="Swap cities"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </motion.button>
              </div>

              <motion.div
                animate={{ x: swapping ? -18 : 0, opacity: swapping ? 0.55 : 1 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <CitySelect
                  label="To"
                  value={search.to}
                  exclude={search.from}
                  error={errors.to}
                  onChange={(to) => {
                    setSearch((s) => ({ ...s, to }))
                    setErrors((e) => ({ ...e, to: '' }))
                  }}
                />
              </motion.div>
            </div>

            <div
              className={`mt-3 grid gap-3 ${
                search.trip === 'round' ? 'md:grid-cols-3' : 'md:grid-cols-2'
              }`}
            >
              <DatePicker
                label="Depart"
                value={search.date}
                error={errors.date}
                onChange={(date) => {
                  setSearch((s) => ({ ...s, date, returnDate: s.returnDate && s.returnDate < date ? '' : s.returnDate }))
                  setErrors((e) => ({ ...e, date: '', returnDate: '' }))
                }}
              />
              <AnimatePresence initial={false}>
                {search.trip === 'round' && (
                  <motion.div
                    key="return-date"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <DatePicker
                      label="Return"
                      value={search.returnDate}
                      min={search.date}
                      error={errors.returnDate}
                      onChange={(returnDate) => {
                        setSearch((s) => ({ ...s, returnDate }))
                        setErrors((e) => ({ ...e, returnDate: '' }))
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <PassengerClass
                search={search}
                error={errors.pax}
                onChange={(next) => {
                  setSearch(next)
                  setErrors((e) => ({ ...e, pax: '' }))
                }}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="shine inline-flex items-center gap-2 rounded-md bg-pine-800 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-card hover:bg-pine-700"
              >
                <Search className="h-4 w-4" />
                Find flights
              </motion.button>
            </div>
          </motion.form>
        </LayoutGroup>
      </div>

      <div className="relative w-full border-t border-[#D7EAF8] bg-[#F4F8FC]">
        <div className="page py-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-pine-800">
            Posted routes
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ROUTES.map(([from, to, price], i) => (
              <motion.button
                key={`${from}-${to}`}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i, duration: 0.4 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSearch((s) => ({ ...s, from: city(from), to: city(to) }))
                  setErrors({})
                }}
                className="rounded-xl border border-[#D7EAF8] bg-white p-4 text-left text-copy shadow-card hover:border-pine-800"
              >
                <p className="font-display text-lg italic text-pine-900">
                  {city(from).city} → {city(to).city}
                </p>
                <p className="mt-1 text-xs font-semibold text-pine-800">
                  {from}–{to} · {price}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
