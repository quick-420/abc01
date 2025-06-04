
"use client";

import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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

  const stripStyle: CSSProperties = {
    transform: `translateY(-${currentIndex * (100 / slidesData.length)}%)`,
    transitionProperty: 'transform',
    transitionTimingFunction: 'ease-in-out',
    transitionDuration: TRANSITION_DURATION,
    height: `${slidesData.length * 100}%`,
  };

  const slideStyle: CSSProperties = {
    height: `${100 / slidesData.length}%`,
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
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 p-4 text-center">
        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6 text-white">
          Welcome to <span className="text-primary">Hygienea</span>
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
          Bridging the gap between doctors and patients with a seamless, integrated healthcare experience. Manage appointments, access records, and connect with ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/auth/patient-register">I'm a Patient</Link>
          </Button>
          <Button size="lg" asChild variant="outline" className="border-primary-foreground/50 text-primary-foreground bg-white/20 hover:bg-white/30 dark:bg-slate-900/30 dark:hover:bg-slate-900/50">
            <Link href="/auth/doctor-register">I'm a Doctor</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
