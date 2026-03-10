"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface LayoutTextFlipProps {
  text: string
  words: string[]
  duration?: number
  className?: string
  wordClassName?: string
}

export function LayoutTextFlip({
  text,
  words,
  duration = 3000,
  className,
  wordClassName,
}: LayoutTextFlipProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [width, setWidth] = useState<number | undefined>(undefined)
  const measureRef = useRef<HTMLSpanElement>(null)
  const hiddenRef = useRef<HTMLDivElement>(null)

  // 测量当前词的宽度
  const measureWidth = useCallback(() => {
    if (hiddenRef.current) {
      const spans = hiddenRef.current.children
      if (spans[currentIndex]) {
        const w = (spans[currentIndex] as HTMLElement).offsetWidth
        setWidth(w)
      }
    }
  }, [currentIndex])

  useEffect(() => {
    measureWidth()
    window.addEventListener("resize", measureWidth)
    return () => window.removeEventListener("resize", measureWidth)
  }, [measureWidth])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length)
        setIsAnimating(false)
      }, 400) // 动画持续时间的一半，用于切换
    }, duration)

    return () => clearInterval(interval)
  }, [words.length, duration])

  return (
    <span className={cn("inline-flex items-baseline justify-center gap-x-3 whitespace-nowrap", className)}>
      {/* 隐藏的测量容器 */}
      <div
        ref={hiddenRef}
        aria-hidden
        className="absolute pointer-events-none opacity-0 h-0 overflow-hidden"
        style={{ whiteSpace: "nowrap" }}
      >
        {words.map((word) => (
          <span key={word} className={cn("inline-block font-semibold", wordClassName)}>
            {word}
          </span>
        ))}
      </div>

      {/* 静态文本 */}
      <span className="shrink-0">{text}</span>

      {/* 翻转文字容器 */}
      <span
        className="relative inline-flex overflow-hidden shrink-0"
        style={{
          width: width ? `${width}px` : "auto",
          transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          verticalAlign: "baseline",
        }}
      >
        <span
          ref={measureRef}
          className={cn(
            "inline-block font-semibold transition-all duration-500",
            wordClassName,
            isAnimating
              ? "translate-y-[-110%] opacity-0 blur-[2px]"
              : "translate-y-0 opacity-100 blur-0"
          )}
          style={{
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {words[currentIndex]}
        </span>
      </span>
    </span>
  )
}
