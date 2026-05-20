"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Github, Linkedin, Mail, Download } from "lucide-react"
import { Button } from "@/src/components/ui/Button"
import navigationData from "@/src/data/navigation.json"
import { toast } from "sonner"
import Image from "next/image"
import personalData from "@/src/data/personal.json"

export function Hero() {
  const [text, setText] = useState("")
  const fullText = personalData.title

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      setText(fullText.slice(0, index))
      index++
      if (index > fullText.length) {
        clearInterval(timer)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [fullText])

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Github":
        return Github
      case "Linkedin":
        return Linkedin
      case "Mail":
        return Mail
      case "Download":
        return Download
      default:
        return Github
    }
  }

  const downloadCV = () => {
    const link = document.createElement("a")
    link.href = "/cv/Adam-s-CV.pdf"
    link.download = "Adam-s-CV.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("CV downloaded successfully!", {
      description: "Your resume has been downloaded and is ready to view.",
      duration: 4000,
    })
  }

  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects")
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleClick = () => {
    const aboutMeSection = document.getElementById("about")
    if (aboutMeSection) {
      aboutMeSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24"
    >
      {/* Background Spotlights */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-radial from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-gradient-radial from-violet-500/15 via-indigo-500/8 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="text-center z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-5xl mx-auto w-full flex flex-col items-center">
        {/* Profile */}
        <div className="mb-6 sm:mb-3 sm:-mt-5">
          <div className="flex justify-center">
            <Image
              src={personalData.img}
              alt={personalData.name}
              width={200}
              height={200}
              className="rounded-full object-cover border-4 border-indigo-500 
                        w-[120px] h-[120px]
                        sm:w-[140px] sm:h-[140px] 
                        md:w-[160px] md:h-[160px] 
                        lg:w-[180px] lg:h-[180px] 
                        xl:w-[200px] xl:h-[200px]"
            />
          </div>
          <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-4 text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 md:mb-2 animated-text-gradient leading-tight">
            {personalData.name}
          </div>
          <div className="text-base sm:text-lg md:text-2xl text-gray-300 min-h-[1.5rem] sm:min-h-[2rem] md:min-h-[2.5rem] lg:min-h-[3rem] xl:min-h-[3.5rem] professional-subtitle px-2 sm:px-4 md:px-6">
            {text}
            <span className="animate-pulse text-indigo-400">|</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 mb-8 sm:mb-10 md:mb-5 px-2 sm:px-4 md:px-6">
          {personalData.socialLinks.map((link, index) => {
            const IconComponent = getIcon(link.icon)
            return (
              <Button
                key={index}
                variant="outline"
                size="lg"
                className="professional-button group text-xs sm:text-sm md:text-base lg:text-lg min-w-0 flex-shrink-0 cursor-pointer px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-3.5"
                onClick={() => window.open(link.url, "_blank", "noopener,noreferrer")}
              >
                <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 mr-1 sm:mr-2 md:mr-2.5 lg:mr-3 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">{link.name}</span>
                <span className="sm:hidden">{link.name.split(" ")[0]}</span>
              </Button>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 px-2 sm:px-4 md:px-6 mb-6">
          {navigationData.buttons.map((button, index) => {
            const IconComponent = button.icon ? getIcon(button.icon) : null
            const handleAction = () => {
              if (button.text === "Download CV") downloadCV()
              if (button.text === "View Projects") scrollToProjects()
            }

            return (
              <Button
                key={index}
                size="lg"
                onClick={handleAction}
                className={`
                  ${button.type === "primary" ? "professional-button-primary group" : "professional-button"} 
                  text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl w-full sm:w-auto min-w-0 
                  cursor-pointer
                  hover:scale-105
                  transition-transform duration-200
                  px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10
                  py-2.5 sm:py-3 md:py-3.5 lg:py-4 xl:py-4.5
                `}
                variant={button.type === "outline" ? "outline" : "default"}
              >
                {IconComponent && (
                  <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 mr-1 sm:mr-2 md:mr-2.5 lg:mr-3 xl:mr-3.5 group-hover:-translate-y-1 transition-transform" />
                )}
                {button.text}
              </Button>
            )
          })}
        </div>

        {/* Chevron Arrow BELOW everything */}
        <div
          className="animate-bounce cursor-pointer mt-6"
          onClick={handleClick}
          title="Scroll to About Me"
        >
          <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-indigo-400 drop-shadow-glow hover:scale-110 transition-transform duration-200" />
        </div>
      </div>
    </section>
  )
}
