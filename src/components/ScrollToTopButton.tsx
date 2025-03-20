/**
 * @file ScrollToTopButton.tsx
 * @copyright SKALE Labs 2024-Present
 */
import { useState, useEffect } from 'react'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { cls } from '@skalenetwork/metaport'
import { Fab } from '@mui/material'

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  return isVisible ? (
    <Fab
      aria-label="scroll to top"
      onClick={scrollToTop}
      size="small"
      className={cls('scrollToTopButton', 'secondary')}
      sx={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        width: 40,
        height: 40,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        '& .MuiSvgIcon-root': {
          color: '#93B8EC',
          fontSize: '1.2rem'
        }
      }}
    >
      <KeyboardArrowUpIcon />
    </Fab>
  ) : null
}