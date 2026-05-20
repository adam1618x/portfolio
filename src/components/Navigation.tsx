"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import navigationData from "@/src/data/navigation.json"
import { AnimatePresence, motion } from "framer-motion"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("#home")

  // Simple, compatible scroll function
  const smoothScroll = (target: string) => {
    const element = document.querySelector(target)
    if (!element) return

    const headerOffset = 8 // adjust for navbar height
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - headerOffset

    // Use native smooth scrolling with fallback
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    } else {
      // Fallback for older browsers
      window.scrollTo(0, offsetPosition)
    }
  }

  // Detect scroll for navbar background & active section
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50)

          // Find active section
          const sections = navigationData.navItems
            .map((item) => ({
              id: item.href,
              element: document.querySelector(item.href) as HTMLElement
            }))
            .filter(section => section.element)

          const scrollPos = window.scrollY + 100

          // Find the current section in view
          let currentSection = "#home"
          for (const section of sections) {
            const { element } = section
            if (element.offsetTop <= scrollPos && 
                element.offsetTop + element.offsetHeight > scrollPos) {
              currentSection = section.id
            }
          }
          
          setActiveSection(currentSection)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-60 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900/80 backdrop-blur-md border-b border-indigo-500/30 shadow-lg"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 relative">
          {/* Brand */}
          <div className="text-2xl font-bold professional-brand">
            {navigationData.brand}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationData.navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  smoothScroll(item.href)
                }}
                className={`relative group transition-colors duration-200 ${
                  activeSection === item.href
                    ? "text-indigo-400 scale-105"
                    : "text-gray-300 hover:text-indigo-400"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ${
                    activeSection === item.href
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </a>
            ))}
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="lg:hidden cursor-pointer p-2 -m-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`absolute inset-0 h-6 w-6 text-white transition-all duration-300 ${
                  isOpen ? "opacity-0 scale-75 rotate-90" : "opacity-100 scale-100 rotate-0"
                }`}
              />
              <X
                className={`absolute inset-0 h-6 w-6 text-white transition-all duration-300 ${
                  isOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 -rotate-90"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden absolute left-4 right-4 top-full bg-gray-800/95 backdrop-blur-md rounded-lg mt-2 p-4 border border-indigo-500/30 shadow-xl"
          >
            {navigationData.navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  smoothScroll(item.href)
                  setIsOpen(false)
                }}
                className={`block py-3 px-2 transition-colors duration-200 rounded-md ${
                  activeSection === item.href
                    ? "text-indigo-400 bg-indigo-500/10"
                    : "text-gray-300 hover:text-indigo-400 hover:bg-gray-700/30"
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.2,
                }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}