'use client';

import React, { useState, useMemo, useRef } from 'react';
import { CldImage } from 'next-cloudinary';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { FRAMES_DATA, Frame } from '@/data/frames';

export default function FrameCatalog() {
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [activeFrame, setActiveFrame] = useState<Frame | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Touch Swipe State
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const filteredFrames = useMemo(() => {
    return FRAMES_DATA.filter((frame) => {
      const matchesMaterial =
        selectedMaterial === 'All' || frame.material === selectedMaterial;
      const matchesStyle =
        selectedStyle === 'All' || frame.style === selectedStyle;
      return matchesMaterial && matchesStyle;
    });
  }, [selectedMaterial, selectedStyle]);

  const handleOpenFrame = (frame: Frame) => {
    setActiveFrame(frame);
    setActiveImageIndex(0);
  };

  const handleNextImage = (totalImages: number) => {
    setActiveImageIndex((prev) => (prev + 1) % totalImages);
  };

  const handlePrevImage = (totalImages: number) => {
    setActiveImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (totalImages: number) => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      handleNextImage(totalImages);
    } else if (distance < -minSwipeDistance) {
      handlePrevImage(totalImages);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Get current active image ID safely
  const currentImageId = activeFrame
    ? activeFrame.images[activeImageIndex] || activeFrame.thumbnailId
    : '';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              OPIC FRAMES
            </h1>
            <p className="text-sm text-slate-500">
              Explore available custom frame designs
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            {filteredFrames.length} Designs Available
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">
              Material
            </label>
            <div className="flex flex-wrap gap-2">
              {['All', 'Wood', 'Metal', 'Acrylic'].map((material) => (
                <button
                  key={material}
                  onClick={() => setSelectedMaterial(material)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    selectedMaterial === material
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {material}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:ml-6">
            <label className="text-xs font-semibold text-slate-500 mb-1">
              Style
            </label>
            <div className="flex flex-wrap gap-2">
              {['All', 'Modern', 'Minimalist', 'Ornate'].map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    selectedStyle === style
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFrames.map((frame) => (
            <div
              key={frame.id}
              onClick={() => handleOpenFrame(frame)}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col"
            >
              <div className="relative aspect-square bg-slate-100 overflow-hidden">
                <CldImage
                  src={frame.thumbnailId}
                  alt={frame.title}
                  width={500}
                  height={500}
                  className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {frame.material}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {frame.style}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                    {frame.title}
                  </h3>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm font-medium text-slate-600 border-t pt-3">
                  <span>{frame.priceRange}</span>
                  <span className="text-blue-600">
                    View {frame.images.length} Images &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal with Swipe & Zoom */}
      {activeFrame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row relative">
            
            <button
              onClick={() => setActiveFrame(null)}
              className="absolute top-3 right-3 z-30 p-2 bg-white/90 rounded-full text-slate-600 hover:text-slate-900 shadow hover:bg-white transition"
            >
              ✕
            </button>

            {/* Gallery Section */}
            <div className="md:w-1/2 flex flex-col bg-slate-100 p-4 justify-between relative">
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd(activeFrame.images.length)}
                className="relative w-full aspect-square rounded-xl overflow-hidden shadow-inner bg-white flex items-center justify-center touch-pan-y"
              >
                <Zoom>
                  <div className="relative w-full h-full flex items-center justify-center cursor-zoom-in">
                    <CldImage
                      src={currentImageId}
                      alt={activeFrame.title}
                      width={600}
                      height={600}
                      className="object-contain w-full h-full max-h-[350px]"
                    />
                  </div>
                </Zoom>

                {activeFrame.images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none z-20">
                    Swipe or tap thumbnails ({activeImageIndex + 1}/{activeFrame.images.length})
                  </div>
                )}
              </div>

              {/* Thumbnails row */}
              {activeFrame.images.length > 1 && (
                <div className="flex gap-2 mt-3 justify-center overflow-x-auto py-1">
                  {activeFrame.images.map((imgId, idx) => (
                    <button
                      key={imgId + idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                        activeImageIndex === idx
                          ? 'border-blue-600 scale-105 shadow-sm'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <CldImage
                        src={imgId}
                        alt={`Preview ${idx + 1}`}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="p-6 md:w-1/2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {activeFrame.material}
                </span>

                <h2 className="text-xl font-bold text-slate-900 my-2">
                  {activeFrame.title}
                </h2>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  {activeFrame.description}
                </p>

                <div className="space-y-3 border-t pt-4">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase">
                      Available Sizes
                    </h4>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {activeFrame.availableSizes.map((size) => (
                        <span
                          key={size}
                          className="text-xs bg-slate-100 border px-2 py-1 rounded font-medium text-slate-700"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase">
                      Estimated Price
                    </h4>
                    <p className="text-lg font-bold text-slate-900">
                      {activeFrame.priceRange}
                    </p>
                  </div>
                </div>
              </div>

              {/* Inquiry Buttons */}
              <div className="mt-6 border-t pt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  Send Request Via
                </p>
                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/917339519500?text=Hi,%20I'm%20interested%20in%20requesting%20a%20quote%20for%20the%20${encodeURIComponent(
                      activeFrame.title
                    )}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex justify-center items-center py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm shadow transition"
                  >
                    WhatsApp
                  </a>

                  <a
                    href={`mailto:opticlerx.official@gmail.com?subject=${encodeURIComponent(
                      `Frame Order Inquiry: ${activeFrame.title}`
                    )}&body=${encodeURIComponent(
                      `Hi Opticlerx Team,\n\nI would like to request more information/quote for:\n\nFrame: ${activeFrame.title}\nPrice Range: ${activeFrame.priceRange}\n\nThanks!`
                    )}`}
                    className="flex-1 inline-flex justify-center items-center py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-sm shadow transition"
                  >
                    Email
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
