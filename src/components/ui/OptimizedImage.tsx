'use client';

import { useState, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
}

// Componente de imagem otimizado com lazy loading e placeholder
export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  className = '',
  fill = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`bg-[var(--surface-elevated)] flex items-center justify-center ${className}`}>
        <span className="text-[var(--text-muted)] text-sm">Imagem indisponível</span>
      </div>
    );
  }

  return (
    <div className={`relative ${fill ? 'absolute inset-0' : ''}`}>
      {/* Placeholder enquanto carrega */}
      {!isLoaded && (
        <div className={`absolute inset-0 bg-[var(--surface-card)] animate-pulse ${className}`} />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`
          ${className}
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </div>
  );
});
