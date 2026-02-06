import { faFolder, faTimes, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

const MediaFormat = ({ media , moved }) => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const openPopup = () => {
    console.log(moved.current);
    if(!moved.current){
        setIsPopupOpen(true);
    setZoomLevel(1);
  };
  }
  const closePopup = () => {
    setIsPopupOpen(false);
    setZoomLevel(1);
  };

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 5));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));
  const resetZoom = () => setZoomLevel(1);

  return (
    <>
      {/* Carte simple */}
    <div  className="min-w-[260px] md:min-w-[300px] flex-shrink-0 ">

      <div className="bg-card rounded-xl border border-custom shadow-custom overflow-hidden cursor-pointer">
        <div onClick={openPopup}>
          <img
            draggable="false"
            src={media.img_path}
            alt={media.img_title}
            className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
          />
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFolder} className="text-primary" />
            <h3 className="text-lg font-semibold text-white">{media.img_title}</h3>
          </div>
        </div>
      </div>

      {/* Popup simple avec zoom */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePopup();
          }}
        >
          {/* Barre de contrôle en haut */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium truncate max-w-[150px] md:max-w-none">
                {media.img_title}
              </span>
              <span className="text-gray-400 text-sm">({Math.round(zoomLevel * 100)}%)</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-black bg-opacity-50 rounded-lg p-1">
                <button
                  onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={zoomLevel <= 1}
                >
                  <FontAwesomeIcon icon={faMinus} className="text-sm md:text-base" />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white hover:bg-gray-700 rounded text-sm"
                >
                  100%
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={zoomLevel >= 5}
                >
                  <FontAwesomeIcon icon={faPlus} className="text-sm md:text-base" />
                </button>
              </div>

              <button
                onClick={closePopup}
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white hover:bg-red-600 rounded-full transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl md:text-2xl" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <img
              draggable="false"
              src={media.img_path}
              alt={media.img_title}
              className="max-w-full max-h-full object-contain select-none transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>
        </div>
        
        
      )}
    </div>

    </>
  );
};

export default MediaFormat;
