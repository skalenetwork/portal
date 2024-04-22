import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    const appContentScrollId = document.getElementById('appContentScroll')
    if (appContentScrollId) {
      appContentScrollId.scroll({ top: 0, behavior: 'auto' })
    }
  }, [pathname])
  return null
}
