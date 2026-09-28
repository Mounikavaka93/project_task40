import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Plane } from 'lucide-react'
import { formatDuration, formatMoney } from '../data/flights.js'

export default function FlightCard({ flight, index, onSelect, onDetails }) {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hover, setHover] = useState(false)

  const onMove = (e) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    const px = (e.clientX - box.left) / box.width - 0.5
    const py = (e.clientY - box.top) / box.height - 0.5
    setTilt({ x: py * -8, y: px * 10 })
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14, scale: 0.97 }}
      transition={{
        layout: { type: 'spring', stiffness: 380, damping: 34 },
        opacity: { duration: 0.32, delay: index * 0.045 },
        y: { duration: 0.4, delay: index * 0.045 },
        scale: { duration: 0.28 },
      }}
      className="[perspective:1000px]"
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false)
          setTilt({ x: 0, y: 0 })
        }}
        animate={{
          y: hover ? -7 : 0,
          rotateX: tilt.x,
          rotateY: tilt.y,
          boxShadow: hover
            ? '0 22px 40px -16px rgba(0, 30, 92, 0.22)'
            : '0 8px 24px -12px rgba(0, 30, 92, 0.12)',
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="rounded-xl border border-[#D7EAF8] border-l-4 border-l-pine-800 bg-paper p-4 text-copy sm:p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.span
              animate={{ rotate: hover ? -8 : 0, scale: hover ? 1.08 : 1 }}
              className="grid h-11 w-11 place-items-center rounded-md text-xs font-bold text-white"
              style={{ background: flight.airline.hue }}
            >
              {flight.airline.code}
            </motion.span>
            <div>
              <p className="font-medium text-copy">{flight.airline.name}</p>
              <p className="text-xs font-medium text-copy-muted">
                {flight.flightNo} · {flight.aircraft}
              </p>
            </div>
          </div>
          <span className="font-display text-2xl font-bold italic text-pine-800">
            {formatMoney(flight.price)}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div>
            <p className="font-display text-2xl font-semibold leading-none">{flight.depart}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-copy-muted">
              {flight.from.code}
            </p>
          </div>
          <div className="min-w-[140px] text-center">
            <p className="text-[11px] font-medium text-copy-muted">{formatDuration(flight.duration)}</p>
            <div className="relative my-1 flex items-center gap-1">
              <span className="h-px flex-1 bg-[#B9D8F0]" />
              <motion.span
                animate={{ x: hover ? [0, 16, 0] : [-16, 16, -16] }}
                transition={{ duration: hover ? 1.1 : 2.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Plane className="h-3.5 w-3.5 text-pine-800" />
              </motion.span>
              <span className="h-px flex-1 bg-[#B9D8F0]" />
            </div>
            <p className="text-[11px] font-medium text-copy-muted">
              {flight.stops === 0 ? 'Nonstop' : `1 stop · ${flight.stopCity}`}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-semibold leading-none">
              {flight.arrive}
              {flight.plusDay && <span className="ml-1 text-xs text-ember-600">+1</span>}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-copy-muted">
              {flight.to.code}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#D7EAF8] pt-4">
          <p className="flex items-center gap-1.5 text-xs font-medium text-copy-muted">
            <Clock className="h-3.5 w-3.5" />
            {flight.seatsLeft} seats left · {flight.cabin}
          </p>
          <div className="flex gap-2">
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={(e) => {
                e.stopPropagation()
                onDetails()
              }}
              className="rounded-md border border-copy/25 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-copy hover:border-pine-700"
            >
              Details
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onSelect}
              className="shine rounded-md bg-pine-800 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-pine-700"
            >
              Select
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.article>
  )
}

function Bone({ className }) {
  return (
    <div
      className={`animate-shimmer rounded ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, #d7eaf8 0%, #f4f8fc 40%, #d7eaf8 80%)',
        backgroundSize: '480px 100%',
      }}
    />
  )
}

export function FlightSkeleton({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className="rounded-xl border border-[#D7EAF8] bg-paper p-5"
    >
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Bone className="h-11 w-11 rounded-md" />
          <div className="space-y-2">
            <Bone className="h-4 w-28" />
            <Bone className="h-3 w-20" />
          </div>
        </div>
        <Bone className="h-7 w-16" />
      </div>
      <Bone className="mt-6 h-10" />
      <Bone className="mt-5 h-8" />
    </motion.div>
  )
}
