'use client'
import React from 'react';
import PetCard from '../components/AuctionCard';
import TiltedCard from '../components/TiltedCard';

const petData = [
  {
    petId: '123',
    name: 'Sharky',
    evolutionLevel: 1,
    stats: { engagement: 12, happiness: 9, memePower: 80 },
    imageSrc: '/show1.png',
    avatarSrc: '/avatars/sharky-avatar.png',
  },
  {
    petId: '456',
    name: 'Bubbles',
    evolutionLevel: 2,
    stats: { engagement: 15, happiness: 12, memePower: 65 },
    imageSrc: '/show2.png',
    avatarSrc: '/avatars/bubbles-avatar.png',
  },
  {
    petId: '789',
    name: 'Nemo',
    evolutionLevel: 3,
    stats: { engagement: 20, happiness: 18, memePower: 90 },
    imageSrc: '/show3.png',
    avatarSrc: '/avatars/nemo-avatar.png',
  },
];

export default function HomepagePreview() {
  return (
    <div className="relative min-h-screen w-full">
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/igb.png)' }}
      />
      
      <img
        src="/ret.png"
        alt="Dog"
        className="absolute bottom-0 left-0 z-40 w-[250px] h-auto max-w-full md:max-w-[30%] sm:max-w-[40%]"
      />
      
      {/* Container for content with padding to center it */}
      <div className="relative min-h-screen w-full flex items-center justify-center p-4">
        {/* Scrollable content box that takes 80% of viewport */}
        <div className="w-4/5 min-h-screen overflow-y-auto bg-white bg-opacity-90 rounded-lg shadow-lg p-4 flex items-center justify-center flex-col space-y-1">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Featured Pets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {petData.map((pet) => (
                <PetCard key={pet.petId} {...pet} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}