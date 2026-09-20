import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  fullPage?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
  fullPage = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-9 h-9 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer Organic Earth Animated Spinner */}
        <div
          className={`${sizeMap[size]} rounded-full border-[#E5DFD5] border-t-[#23382B] border-r-[#C86D51] animate-spin shadow-xs`}
        />
        {/* Inner Pulsing Accent Dot */}
        <div className="absolute w-2 h-2 rounded-full bg-[#C86D51] animate-ping opacity-75" />
      </div>

      {label && (
        <span className="text-xs font-semibold text-[#5C6B66] tracking-wider uppercase font-serif animate-pulse">
          {label}
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[50vh] w-full flex items-center justify-center p-12">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
