import { useState } from 'react';

function QuickActions({ onShareWeather, onAddToFavorites, onRefresh }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => setIsOpen(!isOpen);
  
  const handleShare = () => {
    onShareWeather();
    setIsOpen(false);
  };

  const handleAddFavorite = () => {
    onAddToFavorites();
    setIsOpen(false);
  };
  
  const handleRefresh = () => {
    onRefresh();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Ana buton */}
      <button
        onClick={toggleOpen}
        className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
        aria-label="Hızlı Eylemler"
      >
        <svg className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {/* Alt butonlar */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col items-end space-y-3">
          <button
            onClick={handleShare}
            className="group flex items-center"
            aria-label="Hava durumunu paylaş"
          >
            <span className="mr-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm py-1 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              Paylaş
            </span>
            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
          </button>
          
          <button
            onClick={handleAddFavorite}
            className="group flex items-center"
            aria-label="Favorilere ekle"
          >
            <span className="mr-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm py-1 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              Favorilere ekle
            </span>
            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-yellow-500 dark:text-yellow-400 shadow-md flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </button>
          
          <button
            onClick={handleRefresh}
            className="group flex items-center"
            aria-label="Hava durumunu yenile"
          >
            <span className="mr-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm py-1 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              Yenile
            </span>
            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow-md flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default QuickActions;
