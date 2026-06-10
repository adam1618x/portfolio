"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/Dialog"
import { Images, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/src/components/ui/Button"

type Project = {
    title: string
    image: string
    gallery?: string[]
}

interface ProjectGalleryDialogProps {
    project: Project
    children: React.ReactNode
}

export function ProjectGalleryDialog({ project, children }: ProjectGalleryDialogProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Fallback to single image if no gallery array
    const images = project.gallery && project.gallery.length > 0
        ? project.gallery
        : [project.image]

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl md:max-w-4xl w-full bg-gray-900 border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
                        <Images className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                        {project.title} — Gallery
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    {/* Main Image */}
                    <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden">
                        <img
                            src={images[currentIndex]}
                            alt={`${project.title} screenshot ${currentIndex + 1}`}
                            className="w-full h-full object-cover"
                        />

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors cursor-pointer"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors cursor-pointer"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        {images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                                {currentIndex + 1} / {images.length}
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors cursor-pointer ${index === currentIndex
                                        ? "border-indigo-400"
                                        : "border-gray-700 hover:border-gray-500"
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}