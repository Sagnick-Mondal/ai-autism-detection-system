"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1590650153855-d9e808231d41",
    title: "Understanding Emotions",
    subtitle: "AI that helps children recognize and express feelings",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
    title: "Support That Matters",
    subtitle: "Empowering parents, caregivers, and educators",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74",
    title: "Inclusive AI Design",
    subtitle: "Built with neurodiversity at its core",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b",
    title: "Safe & Ethical Intelligence",
    subtitle: "Privacy-first technology for children",
  },
  {
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d",
    title: "Shaping a Better Tomorrow",
    subtitle: "Where empathy meets explainable AI",
  },
];

export default function AutismCarousel() {
  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-24">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="w-11/12 rounded-3xl h-[70vh] md:h-[80vh]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Netflix-style bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Text Overlay */}
              <div className="absolute bottom-16 left-6 md:left-16 max-w-xl">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                  {slide.title}
                </h2>

                <p className="mt-4 text-lg md:text-xl text-slate-200">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
