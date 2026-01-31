import { useNavigate } from "react-router-dom";
import Navigation from "./Nav";
import { useState, useRef } from "react";
import { useCreateProject } from "../hooks/useCreateProject";
import FieldError from "./FieldError";
import FormOverlay from "./FormOverlay";

const ProjectForm = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { mutate, isPending, error } = useCreateProject();
  const [fieldErrors, setFieldErrors] = useState({});

  // États pour gérer les données du formulaire
  const [formData, setFormData] = useState({
    titre: "" ,
    architect: "" ,
    email_architect: "" ,
    logiciel: "",
    date_realisation: "" ,  
    description: "" ,
    image_globale: null ,
  });

  // États pour les listes dynamiques
  const [contributions, setContributions] = useState(["", ""]);
  const [medias, setMedias] = useState([{ file: null, title: "" }]);

  // État pour la prévisualisation de l'image
  const [imagePreview, setImagePreview] = useState(null);

  // Gérer les changements dans les champs de formulaire
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Gérer le téléchargement de l'image globale
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image_globale: file,
      }));

      // Créer une URL pour la prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gérer l'ajout/suppression des contributions
  const handleAddContribution = () => {
    setContributions((prev) => [...prev, ""]);
  };

  const handleRemoveContribution = (index) => {
    setContributions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContributionChange = (index, value) => {
    setContributions((prev) => {
      const newContributions = [...prev];
      newContributions[index] = value;
      return newContributions;
    });
  };

  // Gérer l'ajout/suppression des médias
  const handleAddMedia = () => {
    setMedias((prev) => [...prev, { file: null, title: "" }]);
  };

  const handleRemoveMedia = (index) => {
    if (medias.length > 1) {
      setMedias((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleMediaFileChange = (index, file) => {
    setMedias((prev) => {
      const newMedias = [...prev];
      newMedias[index].file = file;
      return newMedias;
    });
  };

  const handleMediaTitleChange = (index, value) => {
    setMedias((prev) => {
      const newMedias = [...prev];
      newMedias[index].title = value;
      return newMedias;
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Créer l'objet FormData pour l'envoi
      const formDataToSend = new FormData();

      // Ajouter les champs texte
      Object.keys(formData).forEach((key) => {
        if (key === "image_globale" && formData[key]) {
          // L'image globale sera ajoutée séparément
          return;
        }
        formDataToSend.append(key, formData[key]);
      });

      // Ajouter les listes JSON
      formDataToSend.append(
        "contributions",
        JSON.stringify(contributions.filter((cont) => cont.trim() !== "")),
      );

      const mediaTitles = medias
        .filter((media) => media.title.trim() !== "")
        .map((media) => media.title);
      formDataToSend.append("media_titles", JSON.stringify(mediaTitles));

      // Ajouter l'image globale
      if (formData.image_globale) {
        formDataToSend.append("image_globale", formData.image_globale);
      }

      // Ajouter les fichiers médias
      medias.forEach((media) => {
        if (media.file) {
          formDataToSend.append("files", media.file);
        }
      });

      // Basic client-side validation
      const errors = {};
      if (!formData.titre) errors.titre = "Titre requis";
      if (!formData.architect) errors.architect = "Architecte requis";
      // if (!formData.email_architect) errors.email_architect = "Email requis";
      setFieldErrors(errors);
      if (Object.keys(errors).length) return;

      mutate(formDataToSend, {
        onSuccess: () => navigate("/admin"),
      });
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      // nothing DOM-manipulation wise; react-query handles loading state
    }
  };

  // Fonction pour déclencher l'upload d'image
  const triggerImageUpload = () => {
    document.getElementById("imageUploadInput").click();
  };

  return (
    <>
      <Navigation />
      <div id="addProjectPage" className="pt-16">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="bg-card-dark rounded-xl border border-custom max-w-4xl mx-auto p-6 md:p-8 animate-fade-in relative">
            <h2 className="text-primary text-2xl md:text-3xl font-bold text-center mb-8">
              Create a new project
            </h2>

            <form ref={formRef} id="projectForm" onSubmit={handleSubmit}>
              {/* Informations du projet */}
              <div className="mb-8">
                <h3 className="text-white text-xl font-light mb-4 pb-2 border-b border-custom">
                  Informations du projet
                </h3>

                <div className="mb-6">
                  <label
                    htmlFor="titre"
                    className="block text-custom-gray mb-2"
                  >
                    Titre du projet
                  </label>
                  <input
                    type="text"
                    id="titre"
                    value={formData.titre}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-custom rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                  />
                  {fieldErrors.titre && (
                    <FieldError>{fieldErrors.titre}</FieldError>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="architect"
                      className="block text-custom-gray mb-2"
                    >
                      Architecte
                    </label>
                    <input
                      type="text"
                      id="architect"
                      value={formData.architect}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border border-custom rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                    />
                    {fieldErrors.architect && (
                      <FieldError>{fieldErrors.architect}</FieldError>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email_architect"
                      className="block text-custom-gray mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email_architect"
                      value={formData.email_architect}
                      onChange={handleInputChange}
                      
                      className="w-full bg-white/5 border border-custom rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                    />
                    {fieldErrors.email_architect && (
                      <FieldError>{fieldErrors.email_architect}</FieldError>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="logiciel"
                    className="block text-custom-gray mb-2"
                  >
                    Logiciel
                  </label>
                  <input
                    type="text"
                    id="logiciel"
                    value={formData.logiciel}
                    onChange={handleInputChange}
               
                    className="w-full bg-white/5 border border-custom rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Description du projet */}
              <div className="mb-8">
                <h3 className="text-white text-xl font-light mb-4 pb-2 border-b border-custom">
                  Description du projet
                </h3>
                <div>
                  <textarea
                    id="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-custom rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                  ></textarea>
                  {fieldErrors.description && (
                    <FieldError>{fieldErrors.description}</FieldError>
                  )}
                </div>
              </div>

              {/* Image globale et date */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-custom-gray mb-2">
                      Image globale
                    </label>
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        type="button"
                        className="w-12 h-12 rounded-xl hover:bg-black bg-primary flex items-center justify-center text-white text-xl cursor-pointer transition-colors"
                        onClick={triggerImageUpload}
                      >
                        <i className="fas fa-camera"></i>
                      </button>
                      <span className="text-custom-gray">
                        Cliquer pour ajouter une image
                      </span>
                      <input
                        type="file"
                        id="imageUploadInput"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 rounded-lg object-cover border border-dashed border-custom"
                      />
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="date_realisation"
                      className="block text-custom-gray mb-2"
                    >
                      Date de réalisation
                    </label>
                    <input
                      type="date"
                      id="date_realisation"
                      value={formData.date_realisation}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border border-custom rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Contributions */}
              <div className="mb-8">
                <h3 className="text-white text-xl font-light mb-4 pb-2 border-b border-custom">
                  Contributions
                </h3>
                <div id="contributionsList" className="mb-4">
                  {contributions.map((contribution, index) => (
                    <div key={index} className="flex items-center gap-3 mb-3">
                      <input
                        type="text"
                        placeholder={`Contribution ${index + 1}`}
                        value={contribution}
                        onChange={(e) =>
                          handleContributionChange(index, e.target.value)
                        }
                        className="flex-1 bg-white/5 border border-custom rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveContribution(index)}
                        className="text-red-500 bg-none text-xl p-1 hover:text-red-400 transition-colors"
                        disabled={contributions.length <= 1}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddContribution}
                  className="flex items-center gap-2 text-primary bg-none text-lg hover:text-primary-light transition-colors"
                >
                  <i className="fas fa-plus"></i> Ajouter une contribution
                </button>
              </div>

              {/* Médias */}
              <div className="mb-8">
                <h3 className="text-white text-xl font-light mb-4 pb-2 border-b border-custom">
                  Project Details
                </h3>
                <div id="mediaList" className="mb-4">
                  {medias.map((media, index) => (
                    <div key={index} className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white text-xl">
                          <i className="fas fa-camera"></i>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleMediaFileChange(index, e.target.files[0])
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder={`Titre de l'image ${index + 1}`}
                        value={media.title}
                        onChange={(e) =>
                          handleMediaTitleChange(index, e.target.value)
                        }
                        className="flex-1 bg-white/5 border border-custom rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(index)}
                        className="text-red-500 bg-none text-xl p-1 hover:text-red-400 transition-colors"
                        disabled={medias.length <= 1}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddMedia}
                  className="flex items-center gap-2 text-primary bg-none text-lg hover:text-primary-light transition-colors"
                >
                  <i className="fas fa-plus"></i> Ajouter un média
                </button>
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                id="submitProjectBtn"
                className="w-full flex  bg-[#f18832]  hover:bg-[#f09d59]  cursor-pointer items-center justify-center gap-2  text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="  w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <i className="fas fa-save"></i> Enregistrer le projet
                  </>
                )}
              </button>
              {error && (
                <FieldError>
                  {error.message || "Erreur lors de la soumission"}
                </FieldError>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectForm;
