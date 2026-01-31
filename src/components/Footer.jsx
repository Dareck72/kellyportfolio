const Fouter = () => {
    
    return <>
    <footer className="relative  border-t border-white/10  py-8">
  <div className="container mx-auto px-6">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      
      {/* Copyright */}
      <div className="text-white/50 text-sm">
        © {new Date().getFullYear()} Architectural Portfolio. All rights reserved.
      </div>
      
      {/* Séparateur décoratif (visible uniquement sur desktop) */}
      <div className="hidden md:block h-6 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
      
      {/* Crédits développeurs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
        <span className="text-white/40">Developed by</span>
        <div className="flex items-center gap-6">
          
          {/* Premier développeur */}
          <a style={{ textDecoration: 'none' }}  target="blank"  className="group relative">
            <div className="absolute -inset-x-2 -inset-y-1 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative text-white/70 hover:text-primary transition-colors duration-300 cursor-default">
              Aurel DOSSOU
            </span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></div>
          </a>
          
          {/* Séparateur */}
          <div className="text-white/30">•</div>
          
          {/* Deuxième développeur */}
            <a style={{ textDecoration: 'none' }} target="blank" href="https://wa.me//+2290146685436" className="group relative">
            <div className="absolute -inset-x-2 -inset-y-1 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative text-white/70 hover:text-primary transition-colors duration-300 cursor-default">
              Roc ZOSSOU
            </span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></div>
          </a>
          
        </div>
      </div>
      
    </div>
    
   
  </div>
  
  {/* Effet de lumière subtile en arrière-plan */}
        </footer>
    </>
}
export default Fouter