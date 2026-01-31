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
          className="absolute inset-0 bg-[url('src/assets/image1.png')] bg-cover bg-center opacity-100 transition-opacity duration-1000"
          id="slide1"
        ></div>
        <div
          className="absolute inset-0 bg-[url('src/assets/image2.png')] bg-cover bg-center opacity-0 transition-opacity duration-1000"
          id="slide2"
        ></div>
        <div
          className="absolute inset-0 bg-[url('src/assets/Greenhouse.png')] bg-cover bg-center opacity-0 transition-opacity duration-1000"
          id="slide3"
        ></div>
        <div
          className="absolute inset-0 bg-[url('src/assets/FIFAHouse.png')] bg-cover bg-center opacity-0 transition-opacity duration-1000"
          id="slide4"
        ></div>
      </div>
    </>
  );
};

export default Carroussel;
