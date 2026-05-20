"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { ExternalLink, Github, Star, ChevronDown, ChevronUp, ArrowUpDown, Cpu, Globe, Filter } from "lucide-react"
import Image from "next/image"
import { MetallicTitle } from "./metallic-title"
import projectsData from "@/src/data/projects.json"
import { gsap } from "gsap"
import * as SimpleIcons from "react-icons/si"
import { ProjectCard } from "./ProjectCard"

type SortOption = "order" | "featured" | "title"
type CategoryFilter = "all" | "iot" | "web"
type FilterType = "sort" | "category"

type Project = {
  order: number
  title: string
  description: string
  image: string
  technologies: string[]
  live: string
  featured: boolean
  category?: "iot" | "web"
  // Either single repo or multiple repos
  github?: string
  repositories?: {
    frontend?: string
    backend?: string
  }
}

export function Projects() {
  const [visibleCount, setVisibleCount] = useState(4)
  const [isAnimating, setIsAnimating] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("order")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")
  const projectsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Get technology icon
  const getTechIcon = (techName: string) => {
    const iconMap: { [key: string]: any } = {
      "Next.js": SimpleIcons.SiNextdotjs,
      React: SimpleIcons.SiReact,
      "Node.js": SimpleIcons.SiNodedotjs,
      Supabase: SimpleIcons.SiSupabase,
      MongoDB: SimpleIcons.SiMongodb,
      "Socket.IO": SimpleIcons.SiSocketdotio,
      GetStream: SimpleIcons.SiStreamlit, // Using Streamlit icon as GetStream doesn't have a specific icon
      Express: SimpleIcons.SiExpress,
      WebRTC: SimpleIcons.SiWebrtc,
      "Tailwind CSS": SimpleIcons.SiTailwindcss,
      Figma: SimpleIcons.SiFigma,
      RAG: SimpleIcons.SiGooglegemini,
      "Gemini API": SimpleIcons.SiGooglegemini,
      LangChain: SimpleIcons.SiLangchain,
      "Shadcn UI": SimpleIcons.SiShadcnui,
      Analytics: SimpleIcons.SiGoogleanalytics,
      "UI/UX": SimpleIcons.SiFigma,
    }

    return iconMap[techName] || SimpleIcons.SiCoder
  }

  // Get technology color
  const getTechColor = (techName: string) => {
    const colorMap: { [key: string]: string } = {
      "Next.js": "#000000",
      React: "#61DAFB",
      "Node.js": "#339933",
      Supabase: "#3ECF8E",
      MongoDB: "#47A248",
      "Socket.IO": "#010101",
      GetStream: "#005FFF", // GetStream brand blue
      Express: "#000000",
      WebRTC: "#FF6B6B",
      "Tailwind CSS": "#06B6D4",
      Figma: "#F24E1E",
      RAG: "#4285F4",
      "Gemini API": "#4285F4",
      LangChain: "#1C7A1C",
      "Shadcn UI": "#000000",
      Analytics: "#E37400",
      "UI/UX": "#FF0000",
    }

    return colorMap[techName] || "#6366F1"
  }

  // Check if icon needs white color (for dark icons)
  const needsWhiteColor = (techName: string) => {
    const darkIcons = ["Next.js", "Socket.IO", "Express", "Shadcn UI"]
    return darkIcons.includes(techName)
  }

  // Auto-categorize projects based on technologies if category is not set
  const categorizeProject = (project: Project): "iot" | "web" => {
    if (project.category) return project.category
    
    const iotKeywords = ["Arduino", "Raspberry Pi", "ESP32", "ESP8266", "IoT", "Sensor", "Hardware", "Embedded", "MQTT", "BLE", "WiFi", "Bluetooth"]
    const webKeywords = ["Next.js", "React", "Node.js", "Express", "MongoDB", "Supabase", "Tailwind CSS", "Socket.IO", "WebRTC"]
    
    const hasIoTTech = project.technologies.some(tech => 
      iotKeywords.some(keyword => tech.toLowerCase().includes(keyword.toLowerCase()))
    ) || project.title.toLowerCase().includes("iot") || 
        project.description.toLowerCase().includes("hardware") ||
        project.description.toLowerCase().includes("sensor")
    
    const hasWebTech = project.technologies.some(tech => 
      webKeywords.includes(tech)
    )
    
    // If it has IoT keywords, categorize as IoT, otherwise default to web
    return hasIoTTech ? "iot" : "web"
  }

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let projects = [...projectsData.projects].map(project => ({
      ...project,
      category: project.category ? project.category.toLowerCase() as "iot" | "web" : categorizeProject(project as Project)
    }))


    // Filter by category
    if (categoryFilter !== "all") {
      projects = projects.filter(project => project.category === categoryFilter)
    }

    // Sort projects
    switch (sortBy) {
      case "order":
        return projects.sort((a, b) => a.order - b.order)
      case "featured":
        return projects.sort((a, b) => {
          // Featured projects first, then by order
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return a.order - b.order
        })
      case "title":
        return projects.sort((a, b) => a.title.localeCompare(b.title))
      default:
        return projects.sort((a, b) => a.order - b.order)
    }
  }, [sortBy, categoryFilter])

  const totalProjects = filteredAndSortedProjects.length
  const hasMoreProjects = visibleCount < totalProjects

  // Get category counts
 const categoryCounts = useMemo(() => {
  const allProjects = [...projectsData.projects].map(project => ({
    ...project,
    category: (project.category ? project.category : categorizeProject(project as Project)).toLowerCase() as "iot" | "web"
  }))
  
  return {
    all: allProjects.length,
    iot: allProjects.filter(p => p.category === "iot").length,
    web: allProjects.filter(p => p.category === "web").length
  }
}, [])


  const handleFilterChange = (type: FilterType, value: SortOption | CategoryFilter) => {
    if (isAnimating) return

    // Check if this is the same value as current
    if ((type === "sort" && value === sortBy) || (type === "category" && value === categoryFilter)) return

    setIsAnimating(true)

    // Fade out animation
    const allProjects = projectsRef.current?.querySelectorAll(".project-card")

    if (allProjects) {
      gsap.to(allProjects, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          // Update the appropriate filter
          if (type === "sort") {
            setSortBy(value as SortOption)
          } else {
            setCategoryFilter(value as CategoryFilter)
          }
          
          setVisibleCount(4) // Reset to show first 4 projects

          // Wait for DOM update, then fade in new projects
          setTimeout(() => {
            const newProjects = projectsRef.current?.querySelectorAll(".project-card")

            if (newProjects) {
              gsap.fromTo(
                newProjects,
                { opacity: 0 },
                {
                  opacity: 1,
                  duration: 0.5,
                  stagger: 0.1,
                  ease: "power2.out",
                  onComplete: () => setIsAnimating(false),
                },
              )
            } else {
              setIsAnimating(false)
            }
          }, 50)
        },
      })
    } else {
      if (type === "sort") {
        setSortBy(value as SortOption)
      } else {
        setCategoryFilter(value as CategoryFilter)
      }
      setVisibleCount(4)
      setIsAnimating(false)
    }
  }

  const handleShowMore = () => {
    if (isAnimating) return

    setIsAnimating(true)
    const currentCount = visibleCount
    const newCount = Math.min(visibleCount + 4, totalProjects)

    // Simple button animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      })
    }

    // Update count first
    setVisibleCount(newCount)

    // Wait for DOM update, then animate new projects
    setTimeout(() => {
      const allProjects = projectsRef.current?.querySelectorAll(".project-card")

      if (allProjects) {
        // Get the new projects that just appeared
        const newProjects = Array.from(allProjects).slice(currentCount, newCount)

        // Simple fade in animation
        gsap.fromTo(
          newProjects,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            onComplete: () => setIsAnimating(false),
          },
        )
      } else {
        setIsAnimating(false)
      }
    }, 50)
  }

  const handleShowLess = () => {
    if (isAnimating) return

    setIsAnimating(true)

    // Get projects that will be hidden
    const allProjects = projectsRef.current?.querySelectorAll(".project-card")

    if (allProjects) {
      const hidingProjects = Array.from(allProjects).slice(4)

      // Simple fade out animation
      gsap.to(hidingProjects, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
        onComplete: () => {
          setVisibleCount(4)
          setIsAnimating(false)
        },
      })
    } else {
      setVisibleCount(4)
      setIsAnimating(false)
    }
  }

  // Initial simple animation for first 4 projects
  useEffect(() => {
    const timer = setTimeout(() => {
      const initialProjects = projectsRef.current?.querySelectorAll(".project-card")

      if (initialProjects) {
        // Simple fade in animation
        gsap.fromTo(
          initialProjects,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
        )
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="projects" className="py-20 px-4 relative">
      {/* Section Spotlight */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-purple-500/15 via-indigo-500/8 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <MetallicTitle className="text-4xl md:text-5xl font-bold mb-6 neon-title">{projectsData.title}</MetallicTitle>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 mx-auto professional-line"></div>
          <p className="text-gray-400 mt-4">
            Showing {visibleCount} of {totalProjects} projects
            {/* {categoryFilter !== "all" && (
              <span className="ml-2 px-2 py-1 bg-indigo-500/20 rounded-full text-xs">
                {categoryFilter === "iot" ? "IoT Projects" : "Web Development"}
              </span>
            )} */}
          </p>
        </div>

        {/* Combined Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          {/* Category Filter */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/40 rounded-full border border-indigo-500/20">
            <Filter className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-gray-400 mr-2">Category:</span>
            <div className="flex space-x-1">
              {[
                { key: "all" as CategoryFilter, label: "All", count: categoryCounts.all, icon: null },
                { key: "iot" as CategoryFilter, label: "IoT", count: categoryCounts.iot, icon: Cpu },
                { key: "web" as CategoryFilter, label: "Web", count: categoryCounts.web, icon: Globe },
              ].map((option) => {
                const IconComponent = option.icon
                return (
                  <button
                    key={option.key}
                    onClick={() => handleFilterChange("category", option.key)}
                    disabled={isAnimating}
                    className={`px-3 py-1 rounded-full text-xs transition-all duration-300 flex items-center space-x-1 cursor-pointer ${
                      categoryFilter === option.key
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        : "text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    {IconComponent && <IconComponent className="h-3 w-3" />}
                    <span>{option.label}</span>
                    <span className="opacity-70">({option.count})</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sort Controls */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/40 rounded-full border border-indigo-500/20">
            <ArrowUpDown className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-gray-400 mr-2">Sort by:</span>
            <div className="flex space-x-1">
              {[
                { key: "order" as SortOption, label: "Order" },
                { key: "featured" as SortOption, label: "Featured" },
                { key: "title" as SortOption, label: "Title" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleFilterChange("sort", option.key)}
                  disabled={isAnimating}
                  className={`px-3 py-1 rounded-full text-xs transition-all duration-300 cursor-pointer ${
                    sortBy === option.key
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                      : "text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div ref={projectsRef} className="grid md:grid-cols-2 gap-8 mb-12">
          {filteredAndSortedProjects.slice(0, visibleCount).map((project, index) => (
            <div key={`${project.title}-${index}`} className="project-card">
              <ProjectCard project={project} sortBy={sortBy} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {totalProjects === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No projects found {categoryFilter !== "all" && `in ${categoryFilter === "iot" ? "IoT" : "Web Development"} category`}
            </div>
            <Button
              onClick={() => handleFilterChange("category", "all")}
              className="professional-button"
              variant="outline"
            >
              View All Projects
            </Button>
          </div>
        )}

        {/* Show More/Less Button */}
        {totalProjects > 0 && (
          <div className="text-center">
            {hasMoreProjects ? (
              <Button
                ref={buttonRef}
                onClick={handleShowMore}
                disabled={isAnimating}
                className="professional-button-primary group relative overflow-hidden"
                size="lg"
              >
                <div className="flex items-center">
                  <ChevronDown
                    className={`h-5 w-5 mr-2 transition-transform duration-300 ${isAnimating ? "animate-pulse" : "group-hover:translate-y-1"}`}
                  />
                  <span className="relative z-10">
                    {isAnimating
                      ? "Loading..."
                      : `Show More Projects (${Math.min(4, totalProjects - visibleCount)} more)`}
                  </span>
                </div>

                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Button>
            ) : visibleCount > 4 ? (
              <Button
                ref={buttonRef}
                onClick={handleShowLess}
                disabled={isAnimating}
                className="professional-button group relative overflow-hidden"
                size="lg"
                variant="outline"
              >
                <div className="flex items-center">
                  <ChevronUp
                    className={`h-5 w-5 mr-2 transition-transform duration-300 ${isAnimating ? "animate-pulse" : "group-hover:-translate-y-1"}`}
                  />
                  <span className="relative z-10">{isAnimating ? "Hiding..." : "Show Less"}</span>
                </div>

                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Button>
            ) : null}
          </div>
        )}

        {/* Projects Counter */}
        {totalProjects > 0 && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/40 rounded-full border border-indigo-500/20">
              <div className="flex space-x-1">
                {Array.from({ length: Math.ceil(totalProjects / 4) }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index < Math.ceil(visibleCount / 4)
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                        : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400 ml-2">
                {Math.ceil(visibleCount / 4)} of {Math.ceil(totalProjects / 4)} pages
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}