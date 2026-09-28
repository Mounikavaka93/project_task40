import { useState } from 'react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import { Building2, CreditCard, Wallet } from 'lucide-react'
import { useBooking } from '../context/BookingContext.jsx'
import { formatMoney } from '../data/flights.js'
import TripRail from './TripRail.jsx'

const METHODS = [
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'bank', label: 'Bank', icon: Building2 },
]

const DEMO_CARD = {
  number: '4242 4242 4242 4242',
  name: 'ALEX RIVERS',
  expiry: '12/28',
  cvc: '123',
}

function formatCard(n) {
  return n
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

export default function Payment() {
  const {
    selectedFlight,
    paxCount,
    paymentMethod,
    setPaymentMethod,
    setView,
    setBookingRef,
    seats,
    goTo,
  } = useBooking()
  const [flipped, setFlipped] = useState(false)
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvc: '' })
  const [errors, setErrors] = useState({})
  const [paying, setPaying] = useState(false)
  const shake = useAnimation()

  const total = selectedFlight ? selectedFlight.price * paxCount : 0

  const completePay = () => {
    if (paying) return
    setPaying(true)
    setErrors({})
    window.setTimeout(() => {
      const ref = `QY${Math.random().toString(36).slice(2, 8).toUpperCase()}`
      setBookingRef(ref)
      setView('confirm')
    }, 700)
  }

  const pay = () => {
    if (paymentMethod !== 'card') {
      completePay()
      return
    }

    let nextCard = card
    const empty =
      !card.number.trim() && !card.name.trim() && !card.expiry.trim() && !card.cvc.trim()
    if (empty) nextCard = DEMO_CARD

    const next = {}
    if (nextCard.number.replace(/\s/g, '').length !== 16) next.number = 'Enter 16-digit card number'
    if (!nextCard.name.trim()) next.name = 'Name on card required'
    if (!/^\d{2}\/\d{2}$/.test(nextCard.expiry)) next.expiry = 'Use MM/YY'
    if (nextCard.cvc.length < 3) next.cvc = 'Invalid CVC'

    if (Object.keys(next).length) {
      setErrors(next)
      shake.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } })
      return
    }

    if (empty) setCard(DEMO_CARD)
    completePay()
  }

  if (!selectedFlight) {
    return (
      <section className="page w-full py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-pine-900">Payment</h1>
        <p className="mt-2 text-pine-800">Pick a flight before checkout.</p>
        <button
          type="button"
          onClick={() => goTo('results')}
          className="mt-6 rounded-md bg-pine-800 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white"
        >
          View flights
        </button>
      </section>
    )
  }

  return (
    <section className="page w-full py-10">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-pine-800">Checkout</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-pine-900">Payment</h1>
      <p className="mt-2 text-sm font-medium text-pine-800">
        {paxCount} × {formatMoney(selectedFlight.price)}
        {seats.length ? ` · seats ${seats.join(', ')}` : ''}
      </p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <motion.div animate={shake}>
          <div className="flex gap-2">
            {METHODS.map((m) => {
              const Icon = m.icon
              const on = paymentMethod === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-3 py-3 text-sm font-bold transition ${
                    on
                      ? 'border-pine-800 bg-pine-800 text-white'
                      : 'border-[#D7EAF8] bg-paper text-copy hover:border-pine-600'
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="payMethod"
                      className="pointer-events-none absolute inset-0 rounded-lg bg-pine-800"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{m.label}</span>
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            {paymentMethod === 'card' && (
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-8 grid items-start gap-8 lg:grid-cols-2"
              >
                <div className="card-3d mx-auto h-48 w-full max-w-md lg:mx-0">
                  <motion.div
                    className="relative h-full w-full"
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="card-face absolute inset-0 overflow-hidden rounded-xl bg-gradient-to-br from-pine-700 to-pine-900 p-5 text-white shadow-lift">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-pine-400">
                        <span>Quaythorn</span>
                        <span>Voyage card</span>
                      </div>
                      <p className="mt-10 font-display text-xl tracking-[0.2em]">
                        {card.number || '•••• •••• •••• ••••'}
                      </p>
                      <div className="mt-8 flex justify-between text-xs font-semibold">
                        <span className="uppercase">{card.name || 'Full name'}</span>
                        <span>{card.expiry || 'MM/YY'}</span>
                      </div>
                    </div>
                    <div className="card-face card-back absolute inset-0 rounded-xl bg-pine-800 p-5 text-white shadow-lift">
                      <div className="mt-4 h-10 bg-sand-50" />
                      <div className="mt-6 flex justify-end">
                        <span className="rounded bg-white px-3 py-1 font-mono font-bold text-pine-800">
                          {card.cvc || 'CVC'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="relative z-10 grid gap-3 rounded-xl border border-[#D7EAF8] bg-paper p-4 text-copy sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-copy-muted">
                      Card number
                    </span>
                    <input
                      value={card.number}
                      onChange={(e) => setCard((c) => ({ ...c, number: formatCard(e.target.value) }))}
                      placeholder="4242 4242 4242 4242"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      className="w-full rounded-lg border-2 border-[#D7EAF8] bg-white px-4 py-3 text-sm text-copy outline-none focus:border-pine-800"
                    />
                    {errors.number && (
                      <p className="mt-1 text-xs font-bold text-ember-600">{errors.number}</p>
                    )}
                  </label>
                  <label className="sm:col-span-2">
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-copy-muted">
                      Name on card
                    </span>
                    <input
                      value={card.name}
                      onChange={(e) => setCard((c) => ({ ...c, name: e.target.value.toUpperCase() }))}
                      placeholder="ALEX RIVERS"
                      autoComplete="cc-name"
                      className="w-full rounded-lg border-2 border-[#D7EAF8] bg-white px-4 py-3 text-sm text-copy outline-none focus:border-pine-800"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs font-bold text-ember-600">{errors.name}</p>
                    )}
                  </label>
                  <label>
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-copy-muted">
                      Expiry
                    </span>
                    <input
                      value={card.expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                        if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`
                        setCard((c) => ({ ...c, expiry: v }))
                      }}
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                      className="w-full rounded-lg border-2 border-[#D7EAF8] bg-white px-4 py-3 text-sm text-copy outline-none focus:border-pine-800"
                    />
                    {errors.expiry && (
                      <p className="mt-1 text-xs font-bold text-ember-600">{errors.expiry}</p>
                    )}
                  </label>
                  <label>
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-copy-muted">
                      CVC
                    </span>
                    <input
                      value={card.cvc}
                      onFocus={() => setFlipped(true)}
                      onBlur={() => setFlipped(false)}
                      onChange={(e) =>
                        setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))
                      }
                      placeholder="123"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      className="w-full rounded-lg border-2 border-[#D7EAF8] bg-white px-4 py-3 text-sm text-copy outline-none focus:border-pine-800"
                    />
                    {errors.cvc && (
                      <p className="mt-1 text-xs font-bold text-ember-600">{errors.cvc}</p>
                    )}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCard(DEMO_CARD)
                      setErrors({})
                    }}
                    className="sm:col-span-2 text-left text-xs font-bold uppercase tracking-wide text-pine-800 hover:text-pine-600"
                  >
                    Use demo card 4242…
                  </button>
                </div>
              </motion.div>
            )}

            {paymentMethod !== 'card' && (
              <motion.div
                key={paymentMethod}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="relative z-10 mt-8 rounded-xl border-2 border-[#D7EAF8] bg-paper p-6 text-sm font-medium text-copy shadow-card"
              >
                {paymentMethod === 'wallet'
                  ? 'Wallet is ready in demo mode. Press Pay to confirm the booking instantly.'
                  : 'Bank transfer is ready in demo mode. Press Pay to confirm the booking instantly.'}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-10 mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setView('seats')}
              className="rounded-md border-2 border-pine-800/30 bg-white px-4 py-2.5 text-sm font-bold text-pine-900"
            >
              Back
            </button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={pay}
              disabled={paying}
              className="cursor-pointer rounded-md bg-pine-800 px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-white disabled:cursor-wait disabled:opacity-70"
            >
              {paying ? 'Confirming…' : `Pay ${formatMoney(total)}`}
            </motion.button>
          </div>
        </motion.div>
        <TripRail />
      </div>
    </section>
  )
}
