'use client'

import { useEffect, useState, useRef } from 'react'

const chars = '-_~`!@#$%^&*()+=[]{}|;:,.<>?'

export default function TextScramble({ children, className, trigger = true }: { children: string, className?: string, trigger?: boolean }) {
  const [output, setOutput] = useState(children)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!trigger) return

    let iteration = 0
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setOutput(
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
        if (intervalRef.current) clearInterval(intervalRef.current)
      }

      iteration += 1 / 3
    }, 30)

    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [children, trigger])

  return <span className={className}>{output}</span>
}
