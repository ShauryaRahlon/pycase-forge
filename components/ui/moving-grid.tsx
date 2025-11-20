"use client"

import React, { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface MovingGridProps {
  className?: string
  gridSize?: number
  lineWidth?: number
  lineColor?: string
  speed?: number
}

export function MovingGrid({
  className,
  gridSize = 50,
  lineWidth = 1,
  lineColor = "rgba(255, 255, 255, 0.1)",
  speed = 0.5,
}: MovingGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const offsetRef = useRef({ x: 0, y: 0 })

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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update offset for movement
      offsetRef.current.x += speed * 0.3
      offsetRef.current.y += speed * 0.2

      // Reset offset when it exceeds grid size
      if (offsetRef.current.x >= gridSize) offsetRef.current.x = 0
      if (offsetRef.current.y >= gridSize) offsetRef.current.y = 0

      ctx.strokeStyle = lineColor
      ctx.lineWidth = lineWidth

      // Draw vertical lines
      for (let x = -gridSize + offsetRef.current.x; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let y = -gridSize + offsetRef.current.y; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gridSize, lineWidth, lineColor, speed])

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none fixed inset-0", className)}
    />
  )
}
