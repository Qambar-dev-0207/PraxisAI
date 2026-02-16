'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

interface GlitchTextProps {
  text: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ElementType<any>
  className?: string
  trigger?: boolean // External trigger
}

export default function GlitchText({ text, as: Component = 'span', className, trigger }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const scramble = useCallback(() => {
    let iteration = 0
    
    if (intervalRef.current) clearInterval(intervalRef.current)
    
    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index]
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )
      
      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
      
      iteration += 1 / 3
    }, 30)
  }, [text])

  useEffect(() => {
    if (trigger) {
        scramble()
    }
  }, [trigger, scramble])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = Component as any
  
  return (
    <Tag 
        className={`${className} inline-block`}
        onMouseEnter={scramble}
    >
      {displayText}
    </Tag>
  )
}
