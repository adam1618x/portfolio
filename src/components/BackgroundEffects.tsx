"use client"

import { useState, useEffect } from "react"

// Generate deterministic star positions based on index
const generateStarData = (index: number) => {
  const seed = index * 1234.5678
  const random1 = (Math.sin(seed) + 1) / 2
  const random2 = (Math.sin(seed * 2) + 1) / 2
  const random3 = (Math.sin(seed * 3) + 1) / 2
  const random4 = (Math.sin(seed * 4) + 1) / 2
  const random5 = (Math.sin(seed * 5) + 1) / 2
  const random6 = (Math.sin(seed * 6) + 1) / 2

  let left, top
  if (index < 10) {
    // Top area stars
    left = random1 * 100
    top = random2 * 25
  } else if (index < 20) {
    // Side area stars
    if (random3 > 0.5) {
      left = random1 * 20
      top = 25 + random2 * 50
    } else {
      left = 80 + random1 * 20
      top = 25 + random2 * 50
    }
  } else {
    // Bottom area stars
    left = random1 * 100
    top = 75 + random2 * 25
  }

  const size = random5 > 0.7 ? 2 : random5 > 0.4 ? 1.5 : 1
  const opacity = 0.2 + random6 * 0.4

  return {
    left,
    top,
    size,
    opacity,
    animationDelay: random3 * 4,
    animationDuration: 2 + random4 * 4,
  }
}

export function BackgroundEffects() {
  const [stars, setStars] = useState<Array<any>>([])

  // Generate stars only on the client
  useEffect(() => {
    setStars([...Array(50)].map((_, i) => ({ id: i, ...generateStarData(i) })))
  }, [])

  return (
    <>
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-background"></div>

      {/* Animated Stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size * 4}px`,
              height: `${star.size * 4}px`,
              backgroundColor: `rgba(255, 255, 255, ${star.opacity})`,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.animationDuration}s`,
              boxShadow: `0 0 ${star.size * 4}px rgba(255, 255, 255, ${
                star.opacity * 0.5
              })`,
            }}
          />
        ))}
      </div>

      {/* Static Spotlights */}
      <div
        className="fixed top-20 left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 100%)",
        }}
      ></div>
      <div
        className="fixed bottom-20 right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 100%)",
        }}
      ></div>
      <div
        className="fixed top-1/2 left-1/2 w-64 h-64 rounded-full blur-2xl animate-pulse pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 100%)",
          transform: "translate(-50%, -50%)",
        }}
      ></div>
    </>
  )
}
