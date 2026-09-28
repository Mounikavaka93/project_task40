export const easeOut = [0.22, 1, 0.36, 1]

export const pageTransition = {
  initial: { opacity: 0, y: 28, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -18, filter: 'blur(8px)' },
  transition: { duration: 0.48, ease: easeOut },
}

export const stagger = {
  animate: {
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
}

export const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
}

export const pop = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 22 } },
}
