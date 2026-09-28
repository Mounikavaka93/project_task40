import { AnimatePresence, motion } from 'framer-motion'
import { BookingProvider, useBooking } from './context/BookingContext.jsx'
import { pageTransition } from './motion.js'
import SmoothScroll from './components/SmoothScroll.jsx'
import Navbar from './components/Navbar.jsx'
import SearchSection from './components/SearchSection.jsx'
import FlightResults from './components/FlightResults.jsx'
import PassengerForm from './components/PassengerForm.jsx'
import SeatSelection from './components/SeatSelection.jsx'
import Payment from './components/Payment.jsx'
import Confirmation from './components/Confirmation.jsx'

const views = {
  search: SearchSection,
  results: FlightResults,
  passengers: PassengerForm,
  seats: SeatSelection,
  payment: Payment,
  confirm: Confirmation,
}

function Shell() {
  const { view } = useBooking()
  const Screen = views[view] || SearchSection

  return (
    <SmoothScroll view={view}>
      <div className="flex min-h-screen w-full flex-col bg-[#F4F8FC] text-copy">
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            key={view}
            className="w-full flex-1"
            initial={pageTransition.initial}
            animate={pageTransition.animate}
            exit={pageTransition.exit}
            transition={pageTransition.transition}
          >
            <Screen />
          </motion.main>
        </AnimatePresence>
        <footer className="w-full bg-pine-900 py-6 text-center text-xs font-semibold text-white">
          Quaythorn · desk copy only · no real tickets are issued
        </footer>
      </div>
    </SmoothScroll>
  )
}

export default function App() {
  return (
    <BookingProvider>
      <Shell />
    </BookingProvider>
  )
}
