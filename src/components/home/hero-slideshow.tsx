
"use client";

import type { CSSProperties } from 'react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Slide {
  id: number;
  src: string;
  alt: string;
  hint: string;
}

interface HeroSlideshowProps {
  title: string;
  description: string;
  patientButtonText: string;
  doctorButtonText: string;
}

const slidesData: Slide[] = [
  { id: 1, src: 'https://placehold.co/1280x720.png', alt: 'Compassionate doctor listening to a patient', hint: 'doctor patient' },
  { id: 2, src: 'https://placehold.co/1280x720.png', alt: 'Team of surgeons performing a procedure', hint: 'surgeons operation' },
  { id: 3, src: 'https://placehold.co/1280x720.png', alt: 'Pediatrician with a child in a clinic', hint: 'pediatrician child' },
  { id: 4, src: 'https://placehold.co/1280x720.png', alt: 'Medical researcher analyzing samples in a laboratory', hint: 'researcher lab' },
];

const SLIDE_INTERVAL = 3000; // 3 seconds
const TRANSITION_DURATION_MS = 1000; // 1 second, matching CSS

export function HeroSlideshow({ title, description, patientButtonText, doctorButtonText }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const effectiveSlides = [...slidesData, slidesData[0]];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, SLIDE_INTERVAL);

    return () => {
      clearInterval(intervalId);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentIndex === slidesData.length) { 
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false); 
        setCurrentIndex(0); 
      }, TRANSITION_DURATION_MS);
    } else if (currentIndex === 0 && !isTransitioning) {
      requestAnimationFrame(() => {
         setIsTransitioning(true);
      });
    }
  }, [currentIndex, slidesData.length, isTransitioning]);


  const stripStyle: CSSProperties = {
    transform: `translateY(-${currentIndex * (100 / effectiveSlides.length)}%)`,
    transitionProperty: 'transform',
    transitionTimingFunction: 'ease-in-out',
    transitionDuration: isTransitioning ? `${TRANSITION_DURATION_MS}ms` : '0ms',
    height: `${effectiveSlides.length * 100}%`,
  };

  const slideStyle: CSSProperties = {
    height: `${100 / effectiveSlides.length}%`,
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-muted">
      <div
        className="relative w-full"
        style={stripStyle}
      >
        {effectiveSlides.map((slide, index) => (
          <div
            key={slide.id + (index === slidesData.length ? '-clone' : '')} 
            className="relative w-full"
            style={slideStyle}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              layout="fill"
              objectFit="cover"
              data-ai-hint={slide.hint}
              priority={index === 0 && currentIndex === 0} 
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 p-4 text-center">
        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6 text-white">
          {title.replace("Hygienea", "")} {/* Remove Hygienea if present, then add span */}
          <span className="text-primary">Hygienea</span>
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/auth/patient-register">{patientButtonText}</Link>
          </Button>
          <Button size="lg" asChild variant="outline" className="border-primary-foreground/50 text-primary-foreground bg-white/20 hover:bg-white/30 dark:bg-slate-900/30 dark:hover:bg-slate-900/50">
            <Link href="/auth/doctor-register">{doctorButtonText}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
