export const AIRLINES = [
  { id: 'qy', name: 'Quaythorn Air', code: 'QY', hue: '#001B94' },
  { id: 'nw', name: 'Northwind', code: 'NW', hue: '#4ADDEA' },
  { id: 'so', name: 'Solstice', code: 'SO', hue: '#FF4B2B' },
  { id: 'hj', name: 'HarborJet', code: 'HJ', hue: '#003DA5' },
  { id: 'lu', name: 'Lumen', code: 'LU', hue: '#FF8B6A' },
]

const BASE_PRICES = { economy: 1, premium: 1.7, business: 3.1 }

function hash(str) {
  return [...str].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function minutesToClock(mins) {
  const h = Math.floor(mins / 60) % 24
  const m = mins % 60
  return `${pad(h)}:${pad(m)}`
}

export function searchFlights({ from, to, date, cabin }) {
  const seed = hash(`${from.code}${to.code}${date}${cabin}`)
  const count = 6 + (seed % 3)

  return Array.from({ length: count }, (_, i) => {
    const airline = AIRLINES[(seed + i) % AIRLINES.length]
    const departMins = 360 + ((seed * 17 + i * 97) % 780)
    const duration = 95 + ((seed + i * 41) % 620)
    const arriveMins = departMins + duration
    const stops = (seed + i) % 4 === 0 ? 1 : 0
    const base = 180 + ((seed + i * 53) % 620)
    const price = Math.round(base * BASE_PRICES[cabin] * (stops ? 0.86 : 1.08))
    const flightNo = `${airline.code}${100 + ((seed + i * 13) % 800)}`

    return {
      id: `${flightNo}-${date}-${i}`,
      airline,
      flightNo,
      from,
      to,
      date,
      depart: minutesToClock(departMins),
      arrive: minutesToClock(arriveMins),
      plusDay: arriveMins >= 1440,
      duration,
      stops,
      stopCity: stops ? ['AMS', 'DOH', 'IST', 'FRA'][(seed + i) % 4] : null,
      cabin,
      price,
      seatsLeft: 3 + ((seed + i) % 12),
      aircraft: ['A350-900', '787-9', 'A321neo', '777-300ER'][(seed + i) % 4],
      amenities: ['Wi-Fi', 'Power', stops ? 'Meal' : 'Snack', 'Entertainment'].slice(
        0,
        2 + ((seed + i) % 3),
      ),
      baggage: cabin === 'economy' ? '1 × 8kg cabin' : '1 × 8kg + 1 × 23kg',
      fare: cabin === 'business' ? 'Flexible' : 'Standard',
    }
  })
}

export function formatDuration(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
}

export function formatMoney(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatLongDate(iso) {
  if (!iso) return ''
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
