'use client'

import { useEffect, useState, useRef } from 'react'

const chars = '-_~`!@#$%^&*()+=[]{}|;:,.<>?'

export default function TextScramble({ children, className, trigger = true }: { children: string, className?: string, trigger?: boolean }) {
  const [output, setOutput] = useState(children)
  const [isScrambling, setIsScrambling] = useState(false)
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    if (!trigger) return

    let iteration = 0
    clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setOutput(prev => 
        children
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return children[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )

      if (iteration >= children.length) {
        clearInterval(intervalRef.current)
      }

      iteration += 1 / 3
    }, 30)

    return () => clearInterval(intervalRef.current)
  }, [children, trigger])

  return <span className={className}>{output}</span>
}
