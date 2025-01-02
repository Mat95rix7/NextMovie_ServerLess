import React, { useState } from 'react';
import { X } from 'lucide-react';
import { bookTickets } from '../../services/booking';

export function BookingModal({ showtime, theaterName, onClose }) {
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bookTickets(showtime.id, tickets);
      setSuccess(true);
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Réserver des places</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-4">
            <p className="text-green-600 mb-4">
              Réservation confirmée !
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                {theaterName} - {showtime.time}
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de places
              </label>
              <select
                value={tickets}
                onChange={(e) => setTickets(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Réservation...' : 'Confirmer'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}