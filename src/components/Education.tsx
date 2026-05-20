'use client';

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MetallicTitle } from "./MetallicTitle";
import type { StaticImageData } from "next/image";

import "react-vertical-timeline-component/style.min.css";

import educationData from "@/src/data/education.json";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

type VerticalTimelineProps = {
  children?: React.ReactNode;
  className?: string;
};

type VerticalTimelineElementProps = {
  children?: React.ReactNode;
  className?: string;
  contentStyle?: React.CSSProperties;
  contentArrowStyle?: React.CSSProperties;
  date?: string | React.ReactNode;
  iconStyle?: React.CSSProperties;
  icon?: React.ReactNode;
};

// Dynamically import timeline components to disable SSR
const VerticalTimeline = dynamic<VerticalTimelineProps>(
  () =>
    import("react-vertical-timeline-component").then(
      (mod) => mod.VerticalTimeline
    ),
  { ssr: false }
);

const VerticalTimelineElement = dynamic<VerticalTimelineElementProps>(
  () =>
    import("react-vertical-timeline-component").then(
      (mod) => mod.VerticalTimelineElement
    ),
  { ssr: false }
);

// Define the type for an education object
type EducationType = {
  degree: string;
  institution: string;
  icon: string | StaticImageData;
  iconBg: string;
  date: string;
  points: string[];
};

// Props for EducationCard
type EducationCardProps = {
  education: EducationType;
};

const EducationCard: React.FC<EducationCardProps> = ({ education }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={education.date}
      iconStyle={{ background: education.iconBg }}
      icon={
        <div className="flex justify-center items-center w-full h-full">
          <img
            src={
              typeof education.icon === "string"
                ? education.icon
                : (education.icon as StaticImageData).src
            }
            alt={education.institution}
            className="w-[60%] h-[60%] object-contain"
          />
        </div>
      }
    >
      <div>
        <h3 className="text-white text-[24px] font-bold">
          {education.degree}
        </h3>
        <p
          className="text-secondary text-[16px] font-semibold"
          style={{ margin: 0 }}
        >
          {education.institution}
        </p>
      </div>

      <ul className="mt-5 list-disc ml-5 space-y-2">
        {education.points.map((point, index) => (
          <li
            key={`education-point-${index}`}
            className="text-white-100 text-[14px] pl-1 tracking-wider"
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

export const Education: React.FC = () => {
  return (
    <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-radial from-purple-500/15 via-indigo-500/8 to-transparent rounded-full blur-3xl"></div>

      <motion.div variants={textVariant()}>
        <div className="text-center mb-16">
          <MetallicTitle className="text-4xl md:text-5xl font-bold mb-6 neon-title">
            Education
          </MetallicTitle>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 mx-auto professional-line"></div>
        </div>
      </motion.div>

      <div className="mt-20 flex flex-col">
        <VerticalTimeline>
          {educationData.map((edu, index) => (
            <EducationCard key={`education-${index}`} education={edu} />
          ))}
        </VerticalTimeline>
      </div>
    </section>
  );
};
