import { faArrowsAlt, faFolder, faMinus, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useRef } from 'react';

const MediaFormat = ({ media }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isTouchDragging, setIsTouchDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
    const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });
    const [touchDistance, setTouchDistance] = useState(0);
    const imageRef = useRef(null);
    const containerRef = useRef(null);

    const openPopup = () => {
        setIsPopupOpen(true);
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
    };

    const zoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.5, 5));
    };

    const zoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.5, 1));
    };

    const resetZoom = () => {
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
    };

    // Zoom avec pincement (mobile)
    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            // Deux doigts = pincement
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) + 
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            setTouchDistance(distance);
        } else if (e.touches.length === 1 && zoomLevel > 1) {
            // Un doigt = déplacement si zoomé
            setIsTouchDragging(true);
            setTouchStart({
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y
            });
            setLastTouch({
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            });
        }
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        
        if (e.touches.length === 2) {
            // Zoom avec pincement
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const newDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) + 
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            
            if (touchDistance > 0) {
                const scaleChange = newDistance / touchDistance;
                setZoomLevel(prev => {
                    const newZoom = prev * scaleChange;
                    return Math.max(1, Math.min(5, newZoom));
                });
                setTouchDistance(newDistance);
            }
        } else if (e.touches.length === 1 && isTouchDragging) {
            // Déplacement avec un doigt
            const touch = e.touches[0];
            const deltaX = touch.clientX - lastTouch.x;
            const deltaY = touch.clientY - lastTouch.y;
            
            // Limiter le déplacement
            const containerRect = containerRef.current?.getBoundingClientRect();
            const imageRect = imageRef.current?.getBoundingClientRect();
            
            if (containerRect && imageRect) {
                const maxX = Math.max(0, (imageRect.width * zoomLevel - containerRect.width) / 2);
                const maxY = Math.max(0, (imageRect.height * zoomLevel - containerRect.height) / 2);
                
                setPosition(prev => ({
                    x: Math.max(-maxX, Math.min(maxX, prev.x + deltaX)),
                    y: Math.max(-maxY, Math.min(maxY, prev.y + deltaY))
                }));
            }
            
            setLastTouch({ x: touch.clientX, y: touch.clientY });
        }
    };

    const handleTouchEnd = () => {
        setIsTouchDragging(false);
        setTouchDistance(0);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomIn();
        } else {
            zoomOut();
        }
    };

    const handleMouseDown = (e) => {
        if (zoomLevel > 1) {
            setIsDragging(true);
            setStartPosition({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newX = e.clientX - startPosition.x;
            const newY = e.clientY - startPosition.y;
            
            // Limiter le déplacement pour garder l'image visible
            const containerRect = containerRef.current?.getBoundingClientRect();
            const imageRect = imageRef.current?.getBoundingClientRect();
            
            if (containerRect && imageRect) {
                const maxX = Math.max(0, (imageRect.width * zoomLevel - containerRect.width) / 2);
                const maxY = Math.max(0, (imageRect.height * zoomLevel - containerRect.height) / 2);
                
                setPosition({
                    x: Math.max(-maxX, Math.min(maxX, newX)),
                    y: Math.max(-maxY, Math.min(maxY, newY))
                });
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Double-tap pour zoomer sur mobile
    const handleDoubleTap = (e) => {
        e.preventDefault();
        if (zoomLevel === 1) {
            zoomIn();
        } else {
            resetZoom();
        }
    };

    let lastTap = 0;
    const handleTouchTap = (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 300 && tapLength > 0) {
            handleDoubleTap(e);
        }
        lastTap = currentTime;
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isPopupOpen) {
                closePopup();
            }
            // Zoom avec touches + et -
            if (isPopupOpen && (e.key === '+' || e.key === '=')) {
                e.preventDefault();
                zoomIn();
            }
            if (isPopupOpen && e.key === '-') {
                e.preventDefault();
                zoomOut();
            }
            if (isPopupOpen && e.key === '0') {
                e.preventDefault();
                resetZoom();
            }
        };

        if (isPopupOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeyDown);
            
            // Empêcher le défilement avec la roulette sur la popup
            document.addEventListener('wheel', handleWheel, { passive: false });
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('wheel', handleWheel);
        };
    }, [isPopupOpen]);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <>
            {/* Carte simple */}
            <div className="bg-card rounded-xl border border-custom shadow-custom overflow-hidden cursor-pointer">
                <div onClick={openPopup}>
                    <img 
                        src={media.img_path} 
                        alt={media.img_title} 
                        className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                    />
                </div>
                
                <div className="p-4">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faFolder} className="text-primary"/>
                        <h3 className="text-lg font-semibold text-white">{media.img_title}</h3>
                    </div>
                </div>
            </div>

            {/* Popup avec zoom - support mobile ajouté */}
            {isPopupOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closePopup();
                        }
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
                            {/* Boutons de contrôle de zoom */}
                            <div className="flex items-center gap-1 bg-black bg-opacity-50 rounded-lg p-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        zoomOut();
                                    }}
                                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={zoomLevel <= 1}
                                    aria-label="Zoom arrière"
                                >
                                    <FontAwesomeIcon icon={faMinus} className="text-sm md:text-base"/>
                                </button>
                                
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetZoom();
                                    }}
                                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white hover:bg-gray-700 rounded text-sm"
                                    aria-label="Réinitialiser le zoom"
                                >
                                    100%
                                </button>
                                
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        zoomIn();
                                    }}
                                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={zoomLevel >= 5}
                                    aria-label="Zoom avant"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="text-sm md:text-base"/>
                                </button>
                            </div>
                            
                            {/* Bouton de fermeture */}
                            <button 
                                onClick={closePopup}
                                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white hover:bg-red-600 rounded-full transition-colors"
                                aria-label="Fermer"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl md:text-2xl"/>
                            </button>
                        </div>
                    </div>

                    {/* Conteneur de l'image avec zoom - support tactile ajouté */}
                    <div 
                        ref={containerRef}
                        className="relative flex-1 w-full flex items-center justify-center overflow-hidden touch-none"
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchEnd}
                        onClick={handleTouchTap}
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            zoomIn();
                        }}
                    >
                        <img 
                            ref={imageRef}
                            src={media.img_path} 
                            alt={media.img_title} 
                            className="max-w-full max-h-full object-contain select-none transition-transform duration-200"
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                                cursor: zoomLevel > 1 ? 'grab' : 'default',
                                touchAction: 'none' // Important pour le contrôle tactile
                            }}
                        />
                        
                        {/* Indicateur de zoom pour mobile */}
                        {zoomLevel > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs md:text-sm text-center">
                                <FontAwesomeIcon icon={faArrowsAlt} className="mr-2 hidden md:inline"/>
                                <span className="hidden md:inline">Cliquez-glissez pour naviguer • </span>
                                <span className="md:hidden">Glissez pour naviguer • </span>
                                <span className="hidden md:inline">Double-clic pour zoomer</span>
                                <span className="md:hidden">Double-tap pour zoomer</span>
                            </div>
                        )}
                    </div>

                    {/* Instructions pour mobile */}
                    <div className="absolute bottom-4 text-gray-400 text-xs md:text-sm text-center">
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                            <span className="hidden md:flex md:items-center md:gap-1">
                                <kbd className="px-2 py-1 bg-gray-800 rounded">+</kbd>
                                <span>Zoom avant</span>
                            </span>
                            <span className="hidden md:flex md:items-center md:gap-1">
                                <kbd className="px-2 py-1 bg-gray-800 rounded">-</kbd>
                                <span>Zoom arrière</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="px-2 py-1 bg-gray-800 rounded text-xs">Pincement</span>
                                <span>Zoom mobile</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="px-2 py-1 bg-gray-800 rounded text-xs">Double-tap</span>
                                <span>Zoom/Réinitialiser</span>
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Styles pour améliorer l'expérience mobile */}
            <style jsx>{`
                @media (max-width: 768px) {
                    /* Empêcher les gestes du navigateur */
                    .touch-none {
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                        -webkit-tap-highlight-color: transparent;
                    }
                    
                    /* Améliorer la réactivité tactile */
                    img {
                        -webkit-touch-callout: none;
                    }
                }
            `}</style>
        </>
    );
};

export default MediaFormat;