import React, { useState, useRef, useEffect } from 'react';

const RangeSlider = ({ min, max, step, value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState(null);
  const sliderRef = useRef(null);

  const handleMouseDown = (e, handle) => {
    e.preventDefault();
    setIsDragging(true);
    setActiveHandle(handle);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = Math.round((percentage * (max - min) + min) / step) * step;

    if (activeHandle === 'min' && newValue <= value[1]) {
      onChange([newValue, value[1]]);
    } else if (activeHandle === 'max' && newValue >= value[0]) {
      onChange([value[0], newValue]);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveHandle(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, activeHandle, value]);

  const minPercentage = ((value[0] - min) / (max - min)) * 100;
  const maxPercentage = ((value[1] - min) / (max - min)) * 100;

  return (
    <div className="relative h-8 flex items-center" ref={sliderRef}>
      {/* Track */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-1 bg-gray-300 rounded-full" />
      </div>

      {/* Selected Range */}
      <div
        className="absolute h-1 bg-black rounded-full"
        style={{
          left: `${minPercentage}%`,
          width: `${maxPercentage - minPercentage}%`,
        }}
      />

      {/* Handle Indicators */}
      <div
        className="absolute w-5 h-5 bg-white border-2 border-black rounded-full -translate-x-1/2 cursor-pointer shadow-sm hover:shadow-md transition-shadow z-30"
        style={{ left: `${minPercentage}%` }}
        onMouseDown={(e) => handleMouseDown(e, 'min')}
      />
      <div
        className="absolute w-5 h-5 bg-white border-2 border-black rounded-full -translate-x-1/2 cursor-pointer shadow-sm hover:shadow-md transition-shadow z-30"
        style={{ left: `${maxPercentage}%` }}
        onMouseDown={(e) => handleMouseDown(e, 'max')}
      />
    </div>
  );
};

export default RangeSlider; 