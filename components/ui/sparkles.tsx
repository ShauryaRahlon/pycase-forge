"use client"

import React, { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface SparklesProps {
  className?: string
  density?: number
  speed?: number
  size?: number
  color?: string
}

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  fadeSpeed: number
}

export function Sparkles({
  className,
  density = 50,
  speed = 0.5,
  size = 2,
  color = "#ffffff",
}: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < density; i++) {
        particlesRef.current.push(createParticle())
      }
    }

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * size + 1,
      speedX: (Math.random() - 0.5) * speed,
      speedY: (Math.random() - 0.5) * speed,
      opacity: Math.random(),
      fadeSpeed: Math.random() * 0.02 + 0.01,
    })

    initParticles()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Update opacity (twinkling effect)
        particle.opacity += particle.fadeSpeed
        if (particle.opacity >= 1 || particle.opacity <= 0) {
          particle.fadeSpeed *= -1
        }

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.fillStyle = color
        ctx.globalAlpha = Math.max(0, Math.min(1, particle.opacity))
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw sparkle effect (cross shape)
        if (particle.opacity > 0.7) {
          const lineLength = particle.size * 3
          ctx.strokeStyle = color
          ctx.lineWidth = 0.5
          ctx.globalAlpha = (particle.opacity - 0.7) * 0.5

          ctx.beginPath()
          ctx.moveTo(particle.x - lineLength, particle.y)
          ctx.lineTo(particle.x + lineLength, particle.y)
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y - lineLength)
          ctx.lineTo(particle.x, particle.y + lineLength)
          ctx.stroke()
        }
      })

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [density, speed, size, color])

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none fixed inset-0", className)}
    />
  )
}
