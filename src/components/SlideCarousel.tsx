import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SensorReading, UserSettings } from '../lib/types';
import { Slide1Summary } from './slides/Slide1Summary';
import { Slide2Totals } from './slides/Slide2Totals';
import { Slide3Circuit1 } from './slides/Slide3Circuit1';
import { Slide4Circuit2 } from './slides/Slide4Circuit2';
import { Slide5Circuit3 } from './slides/Slide5Circuit3';

interface SlideCarouselProps {
  readings: SensorReading | null;
  settings: UserSettings | null;
}

export function SlideCarousel({ readings, settings }: SlideCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const slides = [
    <Slide1Summary key="slide1" readings={readings} settings={settings} />,
    <Slide2Totals key="slide2" readings={readings} />,
    <Slide3Circuit1 key="slide3" readings={readings} />,
    <Slide4Circuit2 key="slide4" readings={readings} />,
    <Slide5Circuit3 key="slide5" readings={readings} />,
  ];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative min-h-96">
          {slides[currentSlide]}
        </div>

        <div className="flex items-center justify-between p-6 bg-gray-50 border-t">
          <button
            onClick={handlePrev}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition ${
                  idx === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="text-center text-sm text-gray-500 px-6 pb-4">
          Slide {currentSlide + 1} of {slides.length}
        </div>
      </div>
    </div>
  );
}
