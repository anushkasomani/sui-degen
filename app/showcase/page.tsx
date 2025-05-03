'use client'
import React from 'react';
import PetCard from '../components/AuctionCard';
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
    <div className="bg-white p-4 w-full">
      {/* <header className="bg-white shadow-sm rounded-lg mb-6">
        <div className="py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Digital Pet Collection</h1>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium">
              My Collection
            </button>
            <button className="px-3 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded-md text-sm font-medium">
              Marketplace
            </button>
          </div>
        </div>
      </header> */}

      <main>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Featured Pets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {petData.map((pet) => (
              <PetCard key={pet.petId} {...pet} />
            ))}
          </div>
        </div>
      </main>
    </div>
  ); 
}
