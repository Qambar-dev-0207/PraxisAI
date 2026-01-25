// Custom hook to manage page loading state
// You can adjust the loading duration by changing the timeout value in the component

import { useState, useEffect } from 'react'

export function usePageLoad(durationMs: number = 3000) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, durationMs)

    return () => clearTimeout(timer)
  }, [durationMs])

  return isLoading
}
