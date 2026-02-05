import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  type?: 'card' | 'text' | 'avatar' | 'button';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  count = 1,
  type = 'card'
}) => {
  const baseClasses = "animate-pulse rounded-lg";
  let typeClasses = '';

  switch(type) {
    case 'card':
      typeClasses = "glass p-5 h-32";
      break;
    case 'text':
      typeClasses = "glass h-4 rounded";
      break;
    case 'avatar':
      typeClasses = "glass rounded-full h-10 w-10";
      break;
    case 'button':
      typeClasses = "glass h-10 rounded-lg px-4";
      break;
    default:
      typeClasses = "glass";
  }

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`${baseClasses} ${typeClasses} ${className}`}
    />
  ));

  return <>{skeletons}</>;
};

export default LoadingSkeleton;