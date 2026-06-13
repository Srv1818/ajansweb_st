'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const SLIDES = [
  `${BASE_PATH}/image/hero/hero-1.jpg`,
  `${BASE_PATH}/image/hero/hero-2.jpg`,
  `${BASE_PATH}/image/hero/hero-3.jpg`,
  `${BASE_PATH}/image/hero/hero-4.jpg`,
  `${BASE_PATH}/image/hero/hero-5.jpg`,
  `${BASE_PATH}/image/hero/hero-6.jpg`,
  `${BASE_PATH}/image/hero/hero-7.jpg`,
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
