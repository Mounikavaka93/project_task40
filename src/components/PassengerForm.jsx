import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useBooking } from '../context/BookingContext.jsx'
import TripRail from './TripRail.jsx'

const STEPS = ['Contact', 'Travellers', 'Review']

function Field({ label, value, onChange, error, type = 'text', placeholder }) {
  const ok = value && !error
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-copy-muted">
        {label}
      </span>
      <div className="relative">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-2xl border bg-white px-4 py-3 pr-10 text-sm text-copy outline-none transition ${
            error
              ? 'border-ember-500 ring-2 ring-ember-500/20'
              : ok
                ? 'border-pine-500'
                : 'border-ink-100 focus:border-pine-500 focus:ring-2 focus:ring-pine-500/15'
          }`}
        />
        <AnimatePresence>
          {ok && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-pine-600"
            >
              <Check className="h-4 w-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 text-xs font-medium text-ember-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </label>
  )
}

function blankPax(i, isChild) {
  return { id: i, first: '', last: '', dob: '', passport: '', type: isChild ? 'Child' : 'Adult' }
}

export default function PassengerForm() {
  const { search, contact, setContact, passengers, setPassengers, setView, paxCount } = useBooking()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})

  const formAnim = useAnimation()

  const roster = useMemo(() => {
    if (passengers.length === paxCount) return passengers
    const list = []
    for (let i = 0; i < search.adults; i += 1) list.push(passengers[i] || blankPax(i, false))
    for (let i = 0; i < search.children; i += 1) {
      const idx = search.adults + i
      list.push(passengers[idx] || blankPax(idx, true))
    }
    return list
  }, [passengers, paxCount, search.adults, search.children])

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
  const phoneOk = contact.phone.replace(/\D/g, '').length >= 8

  const validate = () => {
    const next = {}
    if (step === 0) {
      if (!emailOk) next.email = 'Enter a valid email'
      if (!phoneOk) next.phone = 'Enter a valid phone number'
    }
    if (step === 1) {
      roster.forEach((p, i) => {
        if (!p.first.trim()) next[`first-${i}`] = 'First name required'
        if (!p.last.trim()) next[`last-${i}`] = 'Last name required'
        if (!p.dob) next[`dob-${i}`] = 'Date of birth required'
        if (p.passport.replace(/\s/g, '').length < 6) next[`pass-${i}`] = 'Passport too short'
      })
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const next = async () => {
    if (!validate()) {
      await formAnim.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } })
      return
    }
    if (step === 1) setPassengers(roster)
    if (step === 2) {
      setView('seats')
      return
    }
    setStep((s) => s + 1)
  }

  const updatePax = (i, patch) => {
    const nextList = roster.map((p, idx) => (idx === i ? { ...p, ...patch } : p))
    setPassengers(nextList)
  }

  return (
    <section className="page w-full py-10">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-pine-800">Travellers</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-pine-900">Who is flying?</h1>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <motion.div animate={formAnim} className="min-w-0">
          <div className="mt-0">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-pine-800">
          {STEPS.map((s, i) => (
            <span key={s} className={i === step ? 'text-pine-900' : ''}>
              {s}
            </span>
          ))}
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand-200">
          <motion.div
            className="h-full rounded-full bg-pine-700"
            initial={false}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
            initial={{ opacity: 0, x: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -24, filter: 'blur(6px)' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 space-y-4"
        >
          {step === 0 && (
            <div className="rounded-xl border border-[#D7EAF8] bg-paper p-5 text-copy shadow-card">
              <Field
                label="Email"
                type="email"
                value={contact.email}
                placeholder="you@domain.com"
                error={errors.email}
                onChange={(email) => setContact((c) => ({ ...c, email }))}
              />
              <div className="mt-4">
                <Field
                  label="Phone"
                  type="tel"
                  value={contact.phone}
                  placeholder="+1 555 0100"
                  error={errors.phone}
                  onChange={(phone) => setContact((c) => ({ ...c, phone }))}
                />
              </div>
            </div>
          )}

          {step === 1 &&
            roster.map((p, i) => (
              <div key={p.id} className="rounded-xl border border-[#D7EAF8] bg-paper p-4 text-copy shadow-card">
                <p className="mb-3 font-display text-sm font-semibold">
                  Traveller {i + 1} · {p.type}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="First name"
                    value={p.first}
                    error={errors[`first-${i}`]}
                    onChange={(first) => updatePax(i, { first })}
                  />
                  <Field
                    label="Last name"
                    value={p.last}
                    error={errors[`last-${i}`]}
                    onChange={(last) => updatePax(i, { last })}
                  />
                  <Field
                    label="Date of birth"
                    type="date"
                    value={p.dob}
                    error={errors[`dob-${i}`]}
                    onChange={(dob) => updatePax(i, { dob })}
                  />
                  <Field
                    label="Passport"
                    value={p.passport}
                    placeholder="AB1234567"
                    error={errors[`pass-${i}`]}
                    onChange={(passport) => updatePax(i, { passport })}
                  />
                </div>
              </div>
            ))}

          {step === 2 && (
            <div className="rounded-xl border border-[#D7EAF8] bg-paper p-5 text-copy shadow-card">
              <p className="text-sm text-copy-muted">Tickets will be sent to</p>
              <p className="font-medium">{contact.email}</p>
              <p className="text-sm text-copy-muted">{contact.phone}</p>
              <ul className="mt-4 space-y-2">
                {roster.map((p) => (
                  <li key={p.id} className="flex justify-between rounded-xl bg-white px-3 py-2 text-sm">
                    <span>
                      {p.first} {p.last}
                    </span>
                    <span className="text-copy-muted">{p.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => (step === 0 ? setView('results') : setStep((s) => s - 1))}
          className="inline-flex items-center gap-1 rounded-full border border-pine-800/30 bg-white px-4 py-2.5 text-sm font-medium text-pine-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={next}
          className="inline-flex items-center gap-1 rounded-md bg-pine-800 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white"
        >
          {step === 2 ? 'Choose seats' : 'Continue'}
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
        </motion.div>
        <TripRail />
      </div>
    </section>
  )
}
