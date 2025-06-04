
"use client";

import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Slide {
  id: number;
  src: string;
  alt: string;
  hint: string;
}

const slidesData: Slide[] = [
  { id: 1, src: 'https://placehold.co/1280x720.png', alt: 'Compassionate doctor listening to a patient', hint: 'doctor patient' },
  { id: 2, src: 'https://placehold.co/1280x720.png', alt: 'Team of surgeons performing a procedure', hint: 'surgeons operation' },
  { id: 3, src: 'https://placehold.co/1280x720.png', alt: 'Pediatrician with a child in a clinic', hint: 'pediatrician child' },
  { id: 4, src: 'https://placehold.co/1280x720.png', alt: 'Medical researcher analyzing samples in a laboratory', hint: 'researcher lab' },
];

const SLIDE_INTERVAL = 3000; // 3 seconds
const TRANSITION_DURATION = "1s"; // Smooth animation duration

export function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slidesData.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  // CSS styles for the sliding strip and individual slides
  const stripStyle: CSSProperties = {
    transform: `translateY(-${currentIndex * (100 / slidesData.length)}%)`, // Each step is 1/Nth of strip height
    transitionProperty: 'transform',
    transitionTimingFunction: 'ease-in-out',
    transitionDuration: TRANSITION_DURATION,
    height: `${slidesData.length * 100}%`, // The strip is N times the height of the viewport
  };

  const slideStyle: CSSProperties = {
    height: `${100 / slidesData.length}%`, // Each slide is 1/N of the strip's total height, effectively making it viewport height
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-muted"> {/* Viewport */}
      <div
        className="relative w-full" // This inner div is the sliding strip
        style={stripStyle}
      >
        {slidesData.map((slide, index) => (
          <div
            key={slide.id}
            className="relative w-full" // Each slide container within the strip
            style={slideStyle}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              layout="fill"
              objectFit="cover"
              data-ai-hint={slide.hint}
              priority={index === 0} // Prioritize loading the first image
            />
          </div>
        ))}
      </div>
    </div>
  );
}
