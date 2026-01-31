import { useEffect } from "react";

const Carroussel = () => {
  useEffect(() => {
    const slides = ["slide1", "slide2", "slide3", "slide4"];
    let carouselIndex = 0;
    const startCarousel = () => {
      // Initialiser toutes les slides
      slides.forEach((slideId, index) => {
        const slide = document.getElementById(slideId);
        if (slide) {
          slide.style.opacity = index === 0 ? "1" : "0";
        }
      });

      // Démarrer l'intervalle
      let carouselInterval = setInterval(() => {
        // Cacher toutes les slides
        slides.forEach((slideId) => {
          const slide = document.getElementById(slideId);
          if (slide) {
            slide.style.opacity = "0";
          }
        });

        // Afficher la slide suivante
        carouselIndex = (carouselIndex + 1) % slides.length;
        // console.log(carouselIndex);

        const currentSlide = document.getElementById(slides[carouselIndex]);
        if (currentSlide) {
          currentSlide.style.opacity = "1";
        }
      }, 4000);
    };
    startCarousel();
  });
  return (
    <>
      <div className="h-48 md:h-72 lg:h-96 overflow-hidden relative">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-100 transition-opacity duration-1000"
          id="slide1"
        ></div>
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487956382158-bb926046304a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-0 transition-opacity duration-1000"
          id="slide2"
        ></div>
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-0 transition-opacity duration-1000"
          id="slide3"
        ></div>
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-0 transition-opacity duration-1000"
          id="slide4"
        ></div>
      </div>
    </>
  );
};

export default Carroussel;
