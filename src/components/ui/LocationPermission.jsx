import { useState } from 'react';

function LocationPermission({ onRequestLocation }) {
  const [requested, setRequested] = useState(false);

  const handleRequestClick = () => {
    setRequested(true);
    onRequestLocation();
  };

  if (requested) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-blue-800 dark:text-blue-200">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p>Konum izinlerini kontrol ediyoruz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="mb-3 sm:mb-0">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">Konum bilginize erişmemize izin verin</h3>
          <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
            Size en doğru hava durumu bilgilerini sunmak için konumunuza ihtiyacımız var.
          </p>
        </div>
        <button 
          onClick={handleRequestClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          İzin Ver
        </button>
      </div>
    </div>
  );
}

export default LocationPermission;
