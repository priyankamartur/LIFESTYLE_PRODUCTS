import React from 'react';

export default function Skeleton({ variant = 'card', count = 1, className = '' }) {
  const elements = Array.from({ length: count });

  if (variant === 'card') {
    return (
      <>
        {elements.map((_, i) => (
          <div key={i} className={`bg-white border border-gray-150 rounded-[20px] overflow-hidden animate-pulse ${className}`}>
            <div className="aspect-[4/3] bg-gray-100 w-full"></div>
            <div className="p-5 space-y-3">
              <div className="h-3 bg-gray-100 rounded w-1/4"></div>
              <div className="h-5 bg-gray-100 rounded w-3/4"></div>
              <div className="flex justify-between items-center pt-3">
                <div className="h-6 bg-gray-100 rounded w-1/3"></div>
                <div className="h-8 bg-gray-100 rounded w-8"></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'text') {
    return (
      <div className="space-y-2.5 animate-pulse">
        {elements.map((_, i) => (
          <div key={i} className={`h-4 bg-white/10 rounded w-full ${className}`}></div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="border border-white/5 rounded-xl overflow-hidden animate-pulse">
        <div className="bg-bg-elevated h-12 w-full"></div>
        <div className="divide-y divide-white/5 p-4">
          {elements.map((_, i) => (
            <div key={i} className="flex gap-4 py-4 justify-between items-center">
              <div className="h-5 bg-white/10 rounded w-1/4"></div>
              <div className="h-5 bg-white/10 rounded w-1/3"></div>
              <div className="h-5 bg-white/10 rounded w-12"></div>
              <div className="h-5 bg-white/10 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
