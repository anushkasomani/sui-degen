'use client'

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function PetDetails() {
  const searchParams = useSearchParams();
  
  // Get all parameters from the URL
  const petId = searchParams.get('petId');
  const name = searchParams.get('name');
  const imageSrc = searchParams.get('imageSrc');
  const evolutionLevel = searchParams.get('evolutionLevel');
  const avatarSrc = searchParams.get('avatarSrc');
  
  // Parse the stats from URL parameters
  const engagement = searchParams.get('stats.engagement');
  const happiness = searchParams.get('stats.happiness');
  const memePower = searchParams.get('stats.memePower');

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-700">Pet Details</h1>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-gray-700">
          <div className="w-full md:w-1/2">
            {imageSrc && (
              <Image
                src={imageSrc}
                alt={name || 'Pet'}
                width={400}
                height={400}
                className="rounded-lg"
              />
            )}
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-2xl font-semibold">{name}</h2>
            <p className="text-gray-600">ID: {petId}</p>
            <p className="text-gray-600">Evolution Level: {evolutionLevel}</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-lg font-bold">❤️ {engagement}</p>
                <p className="text-sm text-gray-500">Engagement</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">😊 {happiness}</p>
                <p className="text-sm text-gray-500">Happiness</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">🔥 {memePower}</p>
                <p className="text-sm text-gray-500">Meme Power</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}