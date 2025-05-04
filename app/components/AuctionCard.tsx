'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export interface PetCardProps {
  petId: string;
  name: string;
  imageSrc: string;
  evolutionLevel: number;
  stats: {
    engagement: number;
    happiness: number;
    memePower: number;
  };
  avatarSrc: string;
  onFeed?: () => void;
  onTrain?: () => void;
  onEvolve?: () => void;
  onExplore?: () => void;
}

const PetCard: React.FC<PetCardProps> = ({
  petId,
  name,
  imageSrc,
  evolutionLevel,
  stats,
  avatarSrc,
  onFeed = () => {},
  onTrain = () => {},
  onEvolve = () => {},
  onExplore = () => {},
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();

  const handleExplore = () => {
    // Create URL with query parameters
    const queryParams = new URLSearchParams({
      petId,
      name,
      imageSrc,
      evolutionLevel: evolutionLevel.toString(),
      'stats.engagement': stats.engagement.toString(),
      'stats.happiness': stats.happiness.toString(),
      'stats.memePower': stats.memePower.toString(),
      avatarSrc
    });
    
    router.push(`/pet-details?${queryParams.toString()}`);
  };

  return (
    <div 
      className="relative w-64 mx-auto font-sans z-10"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* CARD */}
      <div
        className={`
          relative
          border rounded-lg ${isHovering ? 'border-gray-600 shadow-md' : 'border-gray-400'} 
          bg-white
          overflow-hidden
          transition-all transform duration-300 ease-in-out
          ${isHovering ? '-translate-y-2 scale-102' : 'translate-y-0 scale-100'}
        `}
      >
        {/* IMAGE CONTAINER */}
        <div className="relative w-full h-64 bg-white overflow-hidden">
          {/* IMAGE */}
          <div
            className={`
              relative w-full h-full flex items-center justify-center
              transition-all transform duration-300 ease-in-out
              ${isHovering ? 'scale-95' : 'scale-100'}
            `}
          >
            <div className="relative w-4/5 h-4/5">
              <Image
                src={imageSrc}
                alt={name}
                fill
                style={{ objectFit: "contain" }}
                className="drop-shadow-sm"
              />
            </div>
          </div>
          
          {/* RIGHT PANEL: Feed/Train/Evolve */}
          <div
            className={`
              absolute top-0 right-0 h-full
              flex flex-col items-end justify-center gap-2 pr-2
              transition-all duration-300 ease-in-out
              ${isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
              z-20
            `}
          >
            <button
              onClick={onFeed}
              className="w-16 py-2 px-3 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded shadow-sm transition-colors duration-200"
            >
              Feed
            </button>
            <button
              onClick={onTrain}
              className="w-16 py-2 px-3 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded shadow-sm transition-colors duration-200"
            >
              Train
            </button>
            <button
              onClick={onEvolve}
              className="w-16 py-2 px-3 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded shadow-sm transition-colors duration-200"
            >
              Evolve
            </button>
          </div>
        </div>

        {/* INFO & STATS */}
        <div className="p-4 z-10 relative bg-white">
          <h2 className="text-xl font-bold text-gray-700">{name}</h2>
          <p className="text-xs text-gray-500 mb-2">
            ID: #{petId} · Level: {evolutionLevel}
          </p>
          <div className="grid grid-cols-3 text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">
            <div className="flex items-center justify-center">
              <span className="mr-1">❤️</span>
              <span className="font-medium">{stats.engagement}</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="mr-1">😊</span>
              <span className="font-medium">{stats.happiness}</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="mr-1">🔥</span>
              <span className="font-medium">{stats.memePower}</span>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: Explore More */}
        <div
          onClick={handleExplore}
          className={`
            absolute left-0 right-0 bottom-0
            bg-gray-300 text-gray-600 text-center font-medium
            py-2
            transform transition-transform duration-300 ease-in-out
            ${isHovering ? 'translate-y-0' : 'translate-y-full'}
            cursor-pointer hover:bg-gray-300
            z-20
          `}
        >
          Explore More
        </div>
      </div>
    </div>
  );
};

export default PetCard;