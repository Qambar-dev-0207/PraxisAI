'use client'

import { useState, useEffect, useRef } from 'react'

export function useBinauralBeats() {
  const [isActive, setIsActive] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<{ left: OscillatorNode; right: OscillatorNode } | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const stop = () => {
    if (oscillatorsRef.current) {
      oscillatorsRef.current.left.stop()
      oscillatorsRef.current.right.stop()
      oscillatorsRef.current = null
    }
    if (audioCtxRef.current) {
        audioCtxRef.current.close()
        audioCtxRef.current = null
    }
    setIsActive(false)
  }

  const start = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioContextClass()
      audioCtxRef.current = ctx

      const gainNode = ctx.createGain()
      gainNode.gain.value = 0.1 // Low volume for background
      gainNodeRef.current = gainNode
      gainNode.connect(ctx.destination)

      // Left Channel - 200Hz
      const leftOsc = ctx.createOscillator()
      const leftPanner = ctx.createStereoPanner()
      leftOsc.frequency.value = 200
      leftPanner.pan.value = -1
      leftOsc.connect(leftPanner)
      leftPanner.connect(gainNode)

      // Right Channel - 210Hz (10Hz difference for Alpha/Focus)
      const rightOsc = ctx.createOscillator()
      const rightPanner = ctx.createStereoPanner()
      rightOsc.frequency.value = 210
      rightPanner.pan.value = 1
      rightOsc.connect(rightPanner)
      rightPanner.connect(gainNode)

      leftOsc.start()
      rightOsc.start()

      oscillatorsRef.current = { left: leftOsc, right: rightOsc }
      setIsActive(true)
    } catch (error) {
      console.error('Failed to start binaural beats:', error)
    }
  }

  const toggle = () => (isActive ? stop() : start())

  useEffect(() => {
    return () => {
      if (isActive) stop()
    }
  }, [isActive])

  return { isActive, toggle }
}
