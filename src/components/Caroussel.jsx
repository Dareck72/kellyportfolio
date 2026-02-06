import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import MediaFormat from "./mediaFormat";
const Carousel = ({ medias, autoDelay = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === medias.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? medias.length - 1 : prev - 1
    );
  };

  // 🔁 Auto-slide par défaut
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, autoDelay);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={stopAutoSlide}   // pause au hover
      onMouseLeave={startAutoSlide} // reprend après
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >



{medias.map((media, index) => (
  <div key={index} className="min-w-full flex justify-center">
    <div className="min-w-full md:min-w-full h-[300px] overflow-hidden rounded-lg">
      <img
        src={media.img_path}
        alt={`slide-${index}`}
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  </div>
))}

      </div>

      {/* Bouton gauche */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/60 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center z-10"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      {/* Bouton droit */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/60 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center z-10"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {medias.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
