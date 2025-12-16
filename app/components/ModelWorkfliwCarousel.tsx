"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1600&q=80",
    title: "Upload or Capture an Image",
    description:
      "Parents, caregivers, or professionals can upload an image or capture a photo in real time for emotion analysis. The process is simple, intuitive, and designed for ease of use.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1600&q=80",
    title: "AI Generates Visual Heatmaps",
    description:
      "The model processes the facial image and generates heatmaps that highlight key facial regions influencing the prediction, ensuring transparency in decision-making.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80",
    title: "Explainable AI Analysis",
    description:
      "Multiple XAI techniques including Grad-CAM, Grad-CAM++, Saliency Maps, and SmoothGrad are applied to deeply analyze emotional cues with visual explanations.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1600&q=80",
    title: "Emotion Prediction with Evidence",
    description:
      "The system predicts the detected emotion and presents it alongside the generated heatmap, allowing users to visually verify how the AI reached its conclusion.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=1600&q=80",
    title: "Efficient & Lightweight System",
    description:
      "Optimized deep learning architecture ensures low latency, minimal resource usage, and seamless performance even on limited hardware.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    title: "Fast, Accurate & Easy to Use",
    description:
      "AutiSense delivers accurate predictions in seconds with a clean, user-friendly interface—making advanced AI accessible without technical complexity.",
  },
];

export default function ModelWorkflowCarousel() {
  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-32">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop
        className="w-11/12 mx-auto rounded-3xl h-[75vh] md:h-[85vh]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="h-full">
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/60" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-3xl px-6 md:px-20">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                    {slide.title}
                  </h2>

                  <p className="mt-6 text-lg md:text-xl text-slate-200 leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
