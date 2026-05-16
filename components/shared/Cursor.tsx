"use client"

import { useEffect, useRef } from "react"

export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  let raf: number
  let ringX = 0, ringY = 0, dotX = 0, dotY = 0
  let targetX = 0, targetY = 0

  useEffect(() => {
    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      dot.style.left = `${e.clientX}px`
      dot.style.top = `${e.clientY}px`
    }

    const animate = () => {
      ringX += (targetX - ringX) * 0.1
      ringY += (targetY - ringY) * 0.1
      ring.style.left = `${ringX}px`
      ring.style.top = `${ringY}px`
      raf = requestAnimationFrame(animate)
    }

    const onEnter = (e: MouseEvent) => {
      const el = e.target as Element
      if (el.closest("button,a,input,textarea,[data-cursor]")) {
        document.body.classList.add("cursor-hover")
      }
    }

    const onLeave = () => {
      document.body.classList.remove("cursor-hover")
    }

    const onDown = () => { ring.style.transform = "translate(-50%,-50%) scale(0.75)" }
    const onUp = () => { ring.style.transform = "translate(-50%,-50%) scale(1)" }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseover", onEnter)
    window.addEventListener("mouseout", onLeave)
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseover", onEnter)
      window.removeEventListener("mouseout", onLeave)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        id="cursor-ring"
        ref={ringRef}
        style={{ transform: "translate(-50%, -50%)", willChange: "left, top" }}
      />
      <div
        id="cursor-dot"
        ref={dotRef}
        style={{ transform: "translate(-50%, -50%)", willChange: "left, top" }}
      />
    </>
  )
}
