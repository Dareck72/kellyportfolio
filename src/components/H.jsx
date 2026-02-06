import { useEffect, useRef } from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const HorizontalScroll = ({ children, autoScroll = true, autoDelay = 3000, scrollAmount = 300 }) => {
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const moved = useRef(false);
  const intervalRef = useRef(null);

  const DRAG_THRESHOLD = 8;

  const handleMouseDown = (e) => {
    isDragging.current = true;
    moved.current = false;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    stopAutoScroll();
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;

    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX.current;

    if (Math.abs(walk) > DRAG_THRESHOLD) {
      moved.current = true;
      e.preventDefault();
      containerRef.current.scrollLeft -= walk;
      startX.current = x;

      for (let i = 0; i < containerRef.current.children.length; i++) {
        containerRef.current.children[i].style.pointerEvents = "none";
      }
    }
  };

  const endDrag = () => {
    if (containerRef.current) {
      for (let i = 0; i < containerRef.current.children.length; i++) {
        containerRef.current.children[i].style.pointerEvents = "auto";
      }
    }
    isDragging.current = false;
    startAutoScroll();
  };

  const startAutoScroll = () => {
    if (!autoScroll || !containerRef.current) return;
    stopAutoScroll();
    intervalRef.current = setInterval(() => {
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });

      // boucle si arrivé à la fin
      if (
        containerRef.current.scrollLeft + containerRef.current.clientWidth >=
        containerRef.current.scrollWidth
      ) {
        containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, autoDelay);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  return (
    <div className="relative w-full">
      {/* Bouton gauche */}
      <button
        onClick={() => containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black text-white w-9 h-9 rounded-full flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      {/* Container scroll */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onMouseEnter={stopAutoScroll}   // pause au hover
        onMouseLeaveCapture={startAutoScroll}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { moved: moved });
          }
          return child;
        })}
      </div>

      {/* Bouton droit */}
      <button
        onClick={() => containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black text-white w-9 h-9 rounded-full flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default HorizontalScroll;
