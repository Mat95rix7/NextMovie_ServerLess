import React, { useState } from 'react';
import { MapPin, Clock } from 'lucide-react';
import { BookingModal } from './BookingModal';

export function TheaterCard({ theater }) {
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{theater.name}</h3>
            <p className="text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {theater.address} ({theater.distance})
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Séances disponibles
          </h4>
          <div className="flex flex-wrap gap-3">
            {theater.showtimes.map(showtime => (
              <button
                key={showtime.id}
                onClick={() => setSelectedShowtime(showtime)}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {showtime.time}
                <span className="text-sm text-gray-500 ml-2">
                  ({showtime.seats} places)
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedShowtime && (
        <BookingModal
          showtime={selectedShowtime}
          theaterName={theater.name}
          onClose={() => setSelectedShowtime(null)}
        />
      )}
    </>
  );
}