"use client"

import type React from "react"
import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Mail, MapPin, Phone, Send, MessageCircle, LogOut, ExternalLink } from "lucide-react"
import { MetallicTitle } from "./metallic-title"
import personalData from "@/src/data/personal.json"
import { toast } from "sonner"

export function Contact() {
  const { data: session } = useSession()

  const [formData, setFormData] = useState({
    name: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const currentYear = new Date().getFullYear()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Should not happen but guard anyway
    if (!session?.user?.email) {
      toast.error("Please verify with Google first")
      return
    }

    if (!formData.name.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: session.user.email,   // ← verified by Google, not typed
          message: formData.message,
        }),
      })

      if (res.ok) {
        toast.success("Message sent! Adam will get back to you soon.")
        setFormData({ name: "", message: "" })
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to send message")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

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
                return <span key={index} className="professional-highlight">{word}{" "}</span>
              }
              return word + " "
            })}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left side — unchanged */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white readable-title">LET'S CONNECT</h3>
              <p className="text-gray-300 mb-8 text-lg">{personalData.contact.connectMessage}</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 group">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform professional-icon">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">Email</div>
                  <div className="text-indigo-400">{personalData.contact.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 group">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform professional-icon">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">Phone</div>
                  <div className="text-purple-400">{personalData.contact.phone}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 group">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform professional-icon">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">Location</div>
                  <div className="text-violet-400">{personalData.contact.location}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side — form */}
          <Card className="professional-card-hover">
            <CardHeader>
              <CardTitle className="text-white text-xl sm:text-2xl readable-title flex items-center">
                <MessageCircle className="h-6 w-6 mr-2 text-indigo-400" />
                SEND MESSAGE
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!session ? (
                // ── NOT signed in: show Google button ──
                <div className="flex flex-col items-center gap-4 py-8">
                  <p className="text-gray-400 text-sm text-center">
                    Verify your identity with Google to send a message
                  </p>
                  <Button
  onClick={() => signIn("google", { redirectTo: window.location.href })}
  className="professional-button-primary flex items-center gap-3"
>
  <svg className="h-5 w-5" viewBox="0 0 24 24">...</svg>
  Continue with Google
  <ExternalLink className="h-4 w-4 opacity-50" />
</Button>
<p className="text-xs text-gray-500">Opens in a new tab</p>
                </div>
              ) : (
                // ── Signed in: show form ──
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Verified email badge */}
                  <div className="flex items-center justify-between border border-green-500/30 bg-green-500/5 rounded-lg px-3 py-2.5 mb-4">
                    {/* Left side — constrain width so it never pushes the button */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {session.user?.image ? (
                        <img src={session.user.image} className="w-8 h-8 rounded-full flex-shrink-0" alt="" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 text-xs font-medium flex-shrink-0">
                          {session.user?.email?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">  {/* ← critical for truncate to work */}
                        <div className="text-sm font-medium text-white truncate">{session.user?.email}</div>
                        <div className="text-xs text-green-400 flex items-center gap-1 mt-0.5">
                          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Verified with Google
                        </div>
                      </div>
                    </div>

                    {/* Right side — never shrinks */}
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="text-gray-500 hover:text-gray-300 p-1 ml-2 rounded transition-colors flex-shrink-0"
                      title="Sign out"
                    >
                      <LogOut className="h-4 w-4 cursor-pointer" />
                    </button>

                  </div>

                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="professional-input resize-none"
                    required
                  />

                  <Button
                    type="submit"
                    className="h-10 w-fit professional-button-primary group cursor-pointer flex items-center justify-center mx-auto"
                    disabled={isSubmitting}
                  >
                    <Send className={`h-3 w-3 transition-transform ${isSubmitting ? "animate-pulse" : "group-hover:-translate-y-1"}`} />
                    {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16 pt-8 border-t border-indigo-500/30">
          <p className="text-gray-400 text-lg">
            © {currentYear} <span className="professional-highlight">Mohamed Adam Jemal</span>. Based on open source work by{" "}
            <a href="https://github.com/RayenSahmim/portfolio" target="_blank" rel="noopener noreferrer" className="professional-highlight hover:opacity-80 transition-opacity">Rayen Sahmim</a>.
          </p>
        </div>
      </div>
    </section>
  )
}