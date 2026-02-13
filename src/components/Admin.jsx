import { useNavigate } from "react-router-dom";
import Navigation from "./Nav";
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import ProjectAdminCard from "./ProjectAdminCard";
import { useProjects } from "../hooks/useProjects.";
import { useSetSiteDesc } from "../hooks/setsiteDesc";
import FieldError from "./FieldError";
import FormOverlay from "./FormOverlay";
import { useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faSave,
  faPlus,
  faExclamationTriangle,
  faFolderOpen,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const Admin = () => {
  const navigate = useNavigate();
  const { data, isPending, error } = useProjects();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
  });
  const [preface, setPreface] = useState("");

  // État pour le popup de confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/connexion");
      return;
    }
  }, [navigate]);

  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // État pour stocker les projets filtrés
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Mettre à jour filteredProjects quand data ou deletingId change
  useEffect(() => {
    if (!data) {
      setFilteredProjects([]);
      return;
    }

    // Filtrer les projets en excluant celui qui est en cours de suppression
    const filtered = data.filter((p) => p.id !== deletingId);
    setFilteredProjects(filtered);
  }, [data, deletingId]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSubmitting(true);
    try {
      await api.put("/profile/", profileData);
      alert("Profil mis à jour avec succès");
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil:", err);
      setProfileError("Erreur lors de la mise à jour du profil");
    } finally {
      setProfileSubmitting(false);
    }
  };

  const {
    mutate,
    isPending: isUpdatingPreface,
    error: prefaceError,
  } = useSetSiteDesc();

  const handlePrefaceUpdate = async () => {
    mutate(preface, {
      onSuccess: () => {
        alert("Sucess");
      },
    });
  };

  const handleUpdateProject = async (projectId, partialData) => {
    setUpdatingId(projectId);
    try {
      await api.put(`/projects/update/${projectId}/`, partialData);
      alert("Projet mis à jour");
      // Invalider le cache pour recharger les données
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (err) {
      console.error("Erreur lors de la mise à jour du projet:", err);
      alert("Erreur lors de la mise à jour du projet");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleQuickEdit = (project) => {
    const newTitle = window.prompt(
      "Modifier le titre du projet:",
      project.titre,
    );
    if (newTitle === null) return; // cancelled
    if (newTitle.trim() === project.titre) return; // no change
    handleUpdateProject(project.id, { titre: newTitle });
  };

  // Fonction pour demander la confirmation de suppression
  const requestDeleteConfirmation = (project) => {
    setProjectToDelete(project);
    setShowDeleteConfirm(true);
    setDeleteError(null);
  };

  // Fonction pour effectuer la suppression après confirmation
  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    setDeletingId(projectToDelete.id);
    setDeleteError(null);

    try {
      await api.delete(`/projects/delete/${projectToDelete.id}/`);

      // Mettre à jour l'UI immédiatement
      setFilteredProjects((prev) =>
        prev.filter((p) => p.id !== projectToDelete.id),
      );

      // Invalider le cache pour recharger les données
      await queryClient.invalidateQueries({ queryKey: ["projects"] });

      alert("Projet supprimé avec succès");
    } catch (err) {
      console.error("Erreur lors de la suppression du projet:", err);
      setDeleteError("Erreur lors de la suppression du projet");
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
    }
  };

  // Annuler la suppression
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProjectToDelete(null);
    setDeleteError(null);
  };

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <>
      <Navigation />
      <div id="adminPage" className="pt-16">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="bg-white rounded-xl shadow-custom p-6 text-gray-800 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to your admin page
            </h2>

            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                id="logoutButton"
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profil Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Edit profil
                </h3>
                <div className="h-px bg-gray-300 my-4"></div>

                <div className="relative">
                  <form onSubmit={handleProfileUpdate}>
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-gray-600 mb-2"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-gray-600 mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="mb-6">
                      <label htmlFor="bio" className="block text-gray-600 mb-2">
                        Biographie
                      </label>
                      <textarea
                        id="bio"
                        rows="4"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-2 rounded-lg font-semibold transition-colors"
                    >
                      {profileSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} /> Enregistrer
                        </>
                      )}
                    </button>
                    {profileError && <FieldError>{profileError}</FieldError>}
                    <FormOverlay loading={profileSubmitting} />
                  </form>
                </div>
              </div>

              {/* Projects Management Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Manage projects
                </h3>
                <div className="h-px bg-gray-300 my-4"></div>

                <button
                  onClick={() => navigate("/create-project")}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-all duration-300 mb-4"
                  id="addProjectButton"
                >
                  <FontAwesomeIcon icon={faPlus} /> Add a project
                </button>

                <div className="h-px bg-gray-300 my-4"></div>

                <h4 className="text-lg font-bold text-gray-800 mb-3">
                  My projects ({filteredProjects.length})
                </h4>

                <div
                  className="max-h-72 overflow-y-auto custom-scrollbar pr-2"
                  id="adminProjectsList"
                >
                  {error ? (
                    <div className="text-center py-8 text-red-500">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-3xl mb-2"
                      />
                      <p>Erreur lors du chargement des projets</p>
                    </div>
                  ) : isPending ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FontAwesomeIcon
                        icon={faFolderOpen}
                        className="text-3xl mb-2"
                      />
                      <p>Aucun projet trouvé</p>
                    </div>
                  ) : (
                    filteredProjects.map((project) => (
                      <ProjectAdminCard
                        key={project.id}
                        project={project}
                        onDeleteRequest={requestDeleteConfirmation}
                        onUpdateRequest={null}
                        onQuickEdit={handleQuickEdit}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Preface Section */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Edit preface
              </h3>
              <div className="h-px bg-gray-300 my-4"></div>

              <div className="mb-4">
                <textarea
                  id="prefaceText"
                  rows="6"
                  value={preface}
                  onChange={(e) => setPreface(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="Ajoutez votre texte de préface ici..."
                ></textarea>
              </div>

              <div className="relative inline-block">
                <button
                  onClick={handlePrefaceUpdate}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  disabled={isUpdatingPreface}
                >
                  {isUpdatingPreface ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} /> Sauvegarder la préface
                    </>
                  )}
                </button>
                {prefaceError && (
                  <FieldError>{prefaceError.message || "Erreur"}</FieldError>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup de confirmation de suppression */}
      {showDeleteConfirm && projectToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Confirmer la suppression
              </h3>
              <button
                onClick={cancelDelete}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} className="text-lg" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                Êtes-vous sûr de vouloir supprimer le projet :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-lg text-gray-800 mb-1">
                  {projectToDelete.titre}
                </h4>
                {projectToDelete.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {projectToDelete.description}
                  </p>
                )}
              </div>
              <p className="text-red-600 font-medium">
                ⚠️ Cette action est irréversible !
              </p>
            </div>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{deleteError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
                disabled={deletingId !== null}
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteProject}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                disabled={deletingId !== null}
              >
                {deletingId === projectToDelete.id ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Suppression...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faTrash} />
                    Supprimer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay pour indiquer la suppression en cours */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-700">Suppression en cours...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
