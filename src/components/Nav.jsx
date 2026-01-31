import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px = breakpoint md de Tailwind
    };

    // Vérifier au chargement
    checkMobile();

    // Écouter les changements de taille
    window.addEventListener('resize', checkMobile);

    // Nettoyer l'événement
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fermer le menu quand on clique sur un lien (sur mobile)
  const handleLinkClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  // Empêcher le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Nettoyer quand le composant est démonté
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-dark/95 backdrop-blur-sm z-50 py-4 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div className="text-primary text-2xl font-bold">DOSSOU Honald Kelly</div>
            
            {/* Bouton menu hamburger (mobile) */}
            <button
              className="md:hidden text-white text-2xl cursor-pointer focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMenuOpen}
              id="menuToggle"
            >
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
            </button>
            
            {/* Menu desktop */}
            <div className="hidden md:flex space-x-8" id="navLinks">
              <Link
                to="/"
                className="nav-link text-custom-gray hover:text-primary transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                onClick={handleLinkClick}
              >
                Accueil
              </Link>
              <Link
                to="/about"
                className="nav-link text-custom-gray hover:text-primary transition-colors duration-300"
                onClick={handleLinkClick}
              >
                À propos
              </Link>
              <Link
                to="/admin"
                className="nav-link text-custom-gray hover:text-primary transition-colors duration-300"
                onClick={handleLinkClick}
              >
                Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Menu mobile overlay */}
        <div
          className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          style={{
            top: "65px", // Hauteur de la navbar
          }}
        >
          {/* Overlay sombre */}
          <div
            className={`absolute inset-0  transition-opacity duration-300 ${
              isMenuOpen ? "opacity-50" : "opacity-0"
            }`}
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu mobile */}
          <div
            className={`absolute right-0 w-64 h-[calc(100vh-65px)] bg-dark backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col p-6 space-y-6 ">
              <Link
                to="/"
                className="text-white text-lg font-medium py-3 px-4 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center"
                onClick={handleLinkClick}
              >
                <span className="flex-1">Accueil</span>
                <span className="text-primary">→</span>
              </Link>
              
              <div className="h-px bg-white/10"></div>
              
              <Link
                to="/about"
                className="text-white text-lg font-medium py-3 px-4 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center"
                onClick={handleLinkClick}
              >
                <span className="flex-1">À propos</span>
                <span className="text-primary">→</span>
              </Link>
              
              <div className="h-px bg-white/10"></div>
              
              <Link
                to="/admin"
                className="text-white text-lg font-medium py-3 px-4 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center"
                onClick={handleLinkClick}
              >
                <span className="flex-1">Connexion</span>
                <span className="text-primary">→</span>
              </Link>
              
              {/* Section pour actions supplémentaires sur mobile */}
              {localStorage.getItem("access") && <div className="mt-auto pt-6 border-t border-white/10">
                <div className="text-white/60 text-sm mb-4">
                  Connecté en tant qu'admin
                </div>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                  }}
                  className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon="fa-solid fa-sign-out-alt" />
                  <span>Déconnexion</span>
                </button>
              </div>}
            </div>
          </div>
        </div>
      </nav>

      {/* Styles pour améliorer l'expérience mobile */}
      <style jsx>{`
        /* Améliorations pour Android */
        @media (max-width: 768px) {
          /* Assurer que les liens sont assez grands pour le toucher */
          .nav-link-mobile {
            min-height: 44px;
            min-width: 44px;
            display: flex;
            align-items: center;
          }
          
          /* Empêcher le zoom sur les inputs pour Android */
          input, textarea, select {
            font-size: 16px !important;
          }
          
          /* Améliorer le scroll sur Android */
          .mobile-menu-scroll {
            -webkit-overflow-scrolling: touch;
          }
        }
        
        /* Animation pour le menu */
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
};

export default Navigation;