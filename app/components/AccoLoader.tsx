import { Bed, Coffee, Loader2, Search } from 'lucide-react';
import React from 'react'

const AccoLoader = () => {
    const loadingTexts = [
        "Fluffing the pillows... almost ready!",
        "Searching for the perfect landlord... and a unicorn!",
        "Dusting off the welcome mat for you!",
        "Running up the stairs to check the view... hang tight!",
        "Counting the square footage... one tile at a time.",
        "Negotiating with the neighbors for quieter weekends.",
        "Checking if the Wi-Fi password is '12345678'...",
        "Measuring the distance to your nearest coffee shop... crucial stuff!",
        "Ensuring the fridge can handle midnight snacks!",
        "Matching you with your dream couch-to-floor ratio.",
        "Finding accommodations where laundry day is optional.",
        "Testing the shower pressure... because priorities!",
        "Loading... because teleportation tech isn’t ready yet.",
        "Double-checking the closets for monsters!",
        "Making sure there’s room for all your plants... yes, even that one.",
        "Searching for landlords who actually fix things on time.",
        "Adding extra windows for a brighter future!",
        "Comparing commute times vs. Netflix binge opportunities...",
        "Scouting for a roommate who doesn’t steal your snacks.",
        "Hunting for a place with 'good vibes only' zoning.",
      ]
      const randomIndex = Math.floor(Math.random() * loadingTexts.length);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
      <div className="relative w-32 h-32 mx-auto mb-6">
        <Bed className="w-32 h-32 text-blue-500 animate-bounce" />
        <Coffee className="w-12 h-12 text-brown-500 absolute top-0 right-0 animate-pulse" />
        <Search className="w-16 h-16 text-purple-500 absolute bottom-0 left-0 animate-spin" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Curating Cozy Cribs
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        {
        loadingTexts[randomIndex]}
      </p>
      <div className="flex justify-center items-center space-x-2">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Loading map magic...
        </span>
      </div>
    </div>
  </div>
  )
}

export default AccoLoader
