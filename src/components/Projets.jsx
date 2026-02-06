import { useState, useMemo } from "react";
import { useProjects } from "../hooks/useProjects.";
import ProjectFormat from "./ProjetFormat";
import Loading from "./Loading";
import Error from "./Error";

const Projects = ({ projects }) => {
  const { data, isLoading, error } = useProjects();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Extraire les années uniques des projets
  const allYears = useMemo(() => {
    if (!data) return [];

    const yearsSet = new Set();
    data.forEach((project) => {
      if (project.date_realisation) {
        yearsSet.add(project.date_realisation.toString().substring(0, 4));
      }
    });

    // Convertir en tableau et trier par ordre décroissant
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [data]);

  // Filtrer et trier les données

  const filteredData = useMemo(() => {
    if (!data) return [];

    let result = [...data];

    // Filtrer par année
    if (selectedYear !== "all") {
      result = result.filter(
        (project) =>
          project.date_realisation &&
          project.date_realisation.toString().substring(0,4) === selectedYear,
      );
    }

    // Trier par date
    result.sort((a, b) => {
      // Essaye d'abord avec date, puis avec year
      const dateA = a.date_realisation
          ? new Date(`${a.date_realisation.toString().substring(0,10)}`)
          : new Date(0);
      const dateB = b.date_realisation
          ? new Date(`${b.date_realisation.toString().substring(0,10)}`)
        : new Date(0);
      if (sortOrder == "newest") {
        return dateB - dateA; // Plus récent d'abord
      } else {
        return dateA - dateB; // Plus ancien d'abord
      }

    });
      // alert(result)

    return result;
  }, [data, selectedYear, sortOrder]);
    console.log(filteredData);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <>
      {/* Popup de filtre */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card-dark rounded-xl border border-custom w-full max-w-md animate-fade-in">
            <div className="bg-card px-6 py-4 border-b border-custom flex justify-between items-center">
              <h3 className="text-primary text-xl font-semibold">
                Filtrer les projets
              </h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-white hover:text-primary text-2xl transition-colors"
                aria-label="Fermer"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              {/* Sélection de l'année */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Année</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedYear("all")}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedYear === "all"
                        ? "bg-primary text-white border-primary"
                        : "border-custom text-white hover:border-primary"
                    }`}
                  >
                    Toutes
                  </button>
                  {allYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedYear === year
                          ? "bg-primary text-white border-primary"
                          : "border-custom text-white hover:border-primary"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ordre de tri
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Trier par</h4>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSortOrder("newest")}
                    className={`px-4 py-2 rounded-lg border transition-colors flex-1 ${
                      sortOrder === "newest"
                        ? "bg-primary text-white border-primary"
                        : "border-custom text-white hover:border-primary"
                    }`}
                  >
                    Plus récent
                  </button>
                  <button
                    onClick={() => setSortOrder("oldest")}
                    className={`px-4 py-2 rounded-lg border transition-colors flex-1 ${
                      sortOrder === "oldest"
                        ? "bg-primary text-white border-primary"
                        : "border-custom text-white hover:border-primary"
                    }`}
                  >
                    Plus ancien
                  </button>
                </div>
              </div> */}

              {/* Statistiques */}
              <div className="mb-6 p-4 bg-card rounded-lg">
                <div className="text-white/70 text-sm mb-2">Résultats</div>
                <div className="text-white font-semibold">
                  {filteredData.length} projet
                  {filteredData.length !== 1 ? "s" : ""} trouvé
                  {filteredData.length !== 1 ? "s" : ""}
                  {selectedYear !== "all" && ` pour ${selectedYear}`}
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setSelectedYear("all");
                    setSortOrder("newest");
                  }}
                  className="px-4 py-2 rounded-lg border border-custom text-white hover:border-primary transition-colors flex-1"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors flex-1"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section id="projects" className="mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-in">
          <div className="flex items-center mb-4 md:mb-0">
            <h2 className="text-primary text-2xl md:text-3xl font-bold mr-4">
              Projects
            </h2>
            <div className="hidden md:block flex-grow h-px bg-white/20"></div>
          </div>

          <div className="flex items-center gap-4">
            {/* Affichage des filtres actifs */}
            {(selectedYear !== "all" || sortOrder !== "newest") && (
              <div className="hidden md:flex items-center gap-2">
                {selectedYear !== "all" && (
                  <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full border border-primary/30">
                    {selectedYear}
                  </span>
                )}
                {sortOrder !== "newest" && (
                  <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full border border-primary/30">
                    {sortOrder === "oldest" ? "Anciens" : "Récents"}
                  </span>
                )}
              </div>
            )}

            <button
              onClick={() => setIsFilterOpen(true)}
              className="cursor-pointer flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-all duration-300 hover:-translate-y-1"
              id="filterButton"
              aria-label="Ouvrir le filtre"
            >
              <i className="fas fa-filter"></i>
              <span>Filter</span>
              {(selectedYear !== "all" || sortOrder !== "newest") && (
                <span className="ml-1 w-5 h-5 flex items-center justify-center text-xs bg-white/20 rounded-full">
                  {selectedYear !== "all" && sortOrder !== "newest" ? "2" : "1"}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Affichage mobile des filtres actifs */}
        {(selectedYear !== "all" || sortOrder !== "newest") && (
          <div className="md:hidden mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-white/70 text-sm">Filtres :</span>
            {selectedYear !== "all" && (
              <button
                onClick={() => setSelectedYear("all")}
                className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full border border-primary/30 hover:bg-primary/30 transition-colors"
                aria-label={`Supprimer le filtre année ${selectedYear}`}
              >
                {selectedYear} ×
              </button>
            )}
            {sortOrder !== "newest" && (
              <button
                onClick={() => setSortOrder("newest")}
                className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full border border-primary/30 hover:bg-primary/30 transition-colors"
                aria-label="Supprimer le tri"
              >
                {sortOrder === "oldest" ? "Anciens" : "Récents"} ×
              </button>
            )}
            <button
              onClick={() => {
                setSelectedYear("all");
                setSortOrder("newest");
              }}
              className="text-sm text-white/70 hover:text-primary transition-colors ml-2"
              aria-label="Effacer tous les filtres"
            >
             Clean
            </button>
          </div>
        )}

        {/* Message si aucun projet ne correspond au filtre */}
        {filteredData.length === 0 && data && data.length > 0 ? (
          <div className="text-center py-12 bg-card-dark rounded-xl border border-custom animate-fade-in">
            <div className="text-white/70 mb-2">
             Any project found with the applied filters.
            </div>
            <button
              onClick={() => {
                setSelectedYear("all");
                setSortOrder("newest");
              }}
              className="text-primary hover:underline transition-colors"
              aria-label="Afficher tous les projets"
            >
              Show all projects
            </button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in"
            id="projectsGrid"
          >
            {filteredData.map((project, index) => (
              <ProjectFormat
                projects={projects}
                key={`project-${project.id || index}`}
                project={project}
              />
            ))}
          </div>
        )}

        {/* Informations sur les résultats */}
        {data && data.length > 0 && (
          <div className="mt-8 text-center text-white/60 text-sm">
            {filteredData.length} sur {data.length} projets affichés
            {selectedYear !== "all" && ` • Filtre : Année ${selectedYear}`}
            {sortOrder !== "newest" &&
              ` • Tri : ${sortOrder === "oldest" ? "Plus ancien" : "Plus récent"}`}
          </div>
        )}
      </section>
    </>
  );
};

export default Projects;
