"use client"

import { Mail, MapPin, Phone } from "lucide-react"
import { MetallicTitle } from "./MetallicTitle"
import personalData from "@/src/data/personal.json"

export function Contact() {
  return (
    <section id="contact" className="pt-20 pb-8 px-4 bg-gray-800/20 relative">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-indigo-500/15 via-purple-500/8 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-violet-500/12 via-indigo-500/6 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <MetallicTitle className="text-4xl md:text-5xl font-bold mb-6">GET IN TOUCH</MetallicTitle>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 mx-auto professional-line"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-6">
            {personalData.contact.description.split(" ").map((word, index) => {
              if (word.includes("extraordinary")) {
                return (
                  <span key={index} className="professional-highlight">
                    {word}{" "}
                  </span>
                )
              }
              return word + " "
            })}
          </p>
        </div>

        <div className="flex flex-col items-center space-y-8 max-w-lg mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white readable-title text-center">LET'S CONNECT</h3>
            <p className="text-gray-300 mb-8 text-lg text-center">{personalData.contact.connectMessage}</p>
          </div>

          <div className="space-y-6 w-full">
            <div className="flex items-center space-x-4 group">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform professional-icon flex-shrink-0">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-lg">Email</div>
                <a
                  href={`mailto:${personalData.contact.email}`}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {personalData.contact.email}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4 group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform professional-icon flex-shrink-0">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-lg">Phone</div>
                <a
                  href={`tel:${personalData.contact.phone}`}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {personalData.contact.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4 group">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform professional-icon flex-shrink-0">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-lg">Location</div>
                <div className="text-violet-400">{personalData.contact.location}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}