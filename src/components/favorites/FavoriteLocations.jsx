import { useState, useEffect } from 'react';

function FavoriteLocations({ onSelectLocation }) {
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    // Load favorites from localStorage on component mount
    const storedFavorites = localStorage.getItem('favoriteLocations');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);
  
  const addToFavorites = (cityName) => {
    if (!cityName || cityName.trim() === '') return;
    
    // Prevent duplicates
    if (!favorites.includes(cityName)) {
      const updatedFavorites = [...favorites, cityName];
      setFavorites(updatedFavorites);
      localStorage.setItem('favoriteLocations', JSON.stringify(updatedFavorites));
    }
  };
  
  const removeFromFavorites = (cityName) => {
    const updatedFavorites = favorites.filter(city => city !== cityName);
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteLocations', JSON.stringify(updatedFavorites));
  };
  
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Favori Konumlar</h2>
      
      {favorites.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Henüz favori konum eklemdiniz. Şehir arayarak favorilerinize ekleyebilirsiniz.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {favorites.map((city, idx) => (
            <div 
              key={idx}
              className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectLocation(city)}
            >
              <span className="text-gray-800 dark:text-white">{city}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromFavorites(city);
                }}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoriteLocations;
