import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/* A client-side router swaps the page but leaves the browser's scroll where
   it was. Reset to the top on every navigation, unless the link targets an
   anchor on the new page, in which case scroll to that instead. */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) { el.scrollIntoView({ block: 'start' }); return }
    }
    window.scrollTo(0, 0)
  }, [pathname, search, hash])
  return null
}
