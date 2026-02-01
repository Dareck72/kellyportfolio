import { useRef } from "react";
import React from "react";
const HorizontalScroll = ({ children }) => {
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const moved = useRef(false);

  const DRAG_THRESHOLD = 8; // Seuil pour distinguer clic vs drag

  const handleMouseDown = (e) => {
    isDragging.current = true;
    moved.current = false;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };
const handleMouseMove = (e) => {
  if (!isDragging.current || !containerRef.current) return;

  const x = e.pageX - containerRef.current.offsetLeft;
  const walk = x - startX.current;

  if (Math.abs(walk) > DRAG_THRESHOLD) {
    moved.current = true;
    e.preventDefault();

    // Scroll continu
    containerRef.current.scrollLeft -= walk;

    // Réinitialise startX pour le prochain mouvement
    startX.current = x;

    // Pendant le drag → enfants non interactifs
    for (let i = 0; i < containerRef.current.children.length; i++) {
      containerRef.current.children[i].style.pointerEvents = "none";
    }
  }
};


  const handleMouseUp = (e) => {
    if (!moved.current) {
      // Si pas de drag → clic normal → rien à bloquer
    } else {
      // Drag terminé → réactiver interactions enfants
    for (let i = 0; i < containerRef.current.children.length; i++) {
      containerRef.current.children[i].style.pointerEvents = "auto";
    }
    }
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    if (moved.current) {
      for (let i = 0; i < containerRef.current.children.length; i++) {
        containerRef.current.children[i].style.pointerEvents = "auto";
      }
    }
    isDragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="flex gap-6 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {React.Children.map(children, (child) => {
        // Vérifie que l'enfant est un élément React
        if (React.isValidElement(child)) {
          // Clone l'enfant en ajoutant des props
          return React.cloneElement(child, { moved: moved } );
        }
        return child;
      })}
    </div>
  );
};

export default HorizontalScroll;
