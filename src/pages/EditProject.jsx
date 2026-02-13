import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../components/Nav";
import FieldError from "../components/FieldError";
import { useUpdateProject } from "../hooks/useUpdateProject";
import { useProject } from "../hooks/useProject"; // ⚠️ Hook spécifique au lieu de useProjects
import Loading from "../components/Loading";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Hook dédié pour un seul projet (plus efficace)
  const { data: project, isPending, error } = useProject(id);

  // ✅ Authentication check
  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) navigate("/connexion");
  }, [navigate]);

  if (isPending) {
    return (
      <>
        <Loading />
      </>
    );
  }

  // ✅ ERROR
  if (error) {
    return (
      <>
        <FieldError message={error.message} />
      </>
    );
  }

  // ✅ NOT FOUND
  if (!project) {
    return (
      <>
        <Navigation />
        <div className="pt-16 container mx-auto px-4 py-8">
          <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 p-4 rounded-lg">
            Projet non existant
          </div>
        </div>
      </>
    );
  }

  return <EditProjectForm key={project.id} project={project} />;
};

const EditProjectForm = ({ project }) => {
  const navigate = useNavigate();
  const {
    mutate,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateProject();

  // ✅ Maintenant project est TOUJOURS défini
  const [formData, setFormData] = useState({
    titre: project.titre || "",
    architect: project.architect || "",
    email_architect: project.email_architect || "",
    logiciel: project.logiciel || "",
    date_realisation: project.date_realisation || "",
    description: project.description || "",
    image_globale: null,
  });

  const [contributions, setContributions] = useState(
    project.contributions || [],
  );
  const [existingImageUrl, setExistingImageUrl] = useState(
    project.image_globale || null,
  );
  const [medias, setMedias] = useState([{ file: null, title: "" }]);
  const [imagePreview, setImagePreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // ... TOUS LES HANDLERS RESTENT IDENTIQUES ...

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image_globale: file,
      }));
      setExistingImageUrl(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleAddMedia = () => {
    setMedias((prev) => [...prev, { file: null, title: "" }]);
  };

  const handleRemoveMedia = (index) => {
    setMedias((prev) => prev.filter((_, i) => i !== index));
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

  const triggerImageUpload = () => {
    document.getElementById("imageUploadInput").click();
  };

  const handleRemoveExistingImage = () => {
    setExistingImageUrl(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    const errors = {};
    if (!formData.titre) errors.titre = "Titre requis";
    if (!formData.architect) errors.architect = "Architecte requis";
    if (!formData.description) errors.description = "Description requise";
    if (!formData.date_realisation) errors.date_realisation = "Date requise";
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    try {
      // Créer l'objet FormData pour l'envoi
      const formDataToSend = new FormData();

      // Ajouter les champs texte
      Object.keys(formData).forEach((key) => {
        if (key == "image_globale") {
          // L'image globale sera ajoutée séparément
          return;
        }
        formDataToSend.append(key, formData[key]);
      });
        formDataToSend.append("replace_all_medias", true);

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
        console.log('ajout ')
      } 

      // Ajouter les fichiers médias
      medias.forEach((media) => {
        if (media.file) {
          formDataToSend.append("files", media.file);
        }
      });
//     for (let [key, value] of formDataToSend.entries()) {
//   console.log(key, value);
// }


      mutate(
        { id: project.id, data: formDataToSend },
        {
          onSuccess: () => navigate("/admin"),
        },
      );
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <>
      <Navigation />
      <div id="editProjectPage" className="pt-16">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="bg-card-dark rounded-xl border border-custom max-w-4xl mx-auto p-6 md:p-8 animate-fade-in relative">
            {/* En-tête */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate("/admin")}
                className="text-custom-gray hover:text-white transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Retour
              </button>
              <h2 className="text-primary text-2xl md:text-3xl font-bold">
                Modifier le projet
              </h2>
              <div className="w-20"></div>
            </div>

            {/* Message d'avertissement médias */}
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
              <div className="flex items-start gap-3">
                <i className="fas fa-exclamation-triangle text-yellow-500 text-xl mt-1"></i>
                <div>
                  <p className="text-yellow-500 font-semibold mb-1">
                    Attention : Remplacement complet des médias
                  </p>
                  <p className="text-custom-gray text-sm">
                    Tous les médias existants du projet seront{" "}
                    <span className="text-yellow-500 font-semibold">
                      définitivement effacés
                    </span>{" "}
                    et remplacés par les nouveaux médias que vous allez ajouter
                    ci-dessous.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
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

              {/* Description */}
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
                  />
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
                        Cliquer pour changer l'image
                      </span>
                      <input
                        type="file"
                        id="imageUploadInput"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    <div className="relative inline-block">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 rounded-lg object-cover border border-dashed border-custom"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData((prev) => ({
                                ...prev,
                                image_globale: null,
                              }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ) : existingImageUrl ? (
                        <div className="relative">
                          <img
                            src={existingImageUrl}
                            alt={project.titre}
                            className="w-32 h-32 rounded-lg object-cover border border-dashed border-custom"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveExistingImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-lg border border-dashed border-custom flex items-center justify-center text-custom-gray">
                          <i className="fas fa-image text-3xl"></i>
                        </div>
                      )}
                    </div>
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
                      value={formData.date_realisation?.substring(0, 10) || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border border-custom rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                    />
                    {fieldErrors.date_realisation && (
                      <FieldError>{fieldErrors.date_realisation}</FieldError>
                    )}
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
                  Nouveaux médias
                </h3>

                <div className="mb-4 text-sm text-custom-gray bg-white/5 p-3 rounded-lg border border-custom">
                  <i className="fas fa-info-circle mr-2 text-primary"></i>
                  Les médias que vous ajoutez ici{" "}
                  <span className="text-yellow-500 font-semibold">
                    remplaceront intégralement
                  </span>{" "}
                  tous les médias existants du projet.
                </div>

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

              {/* Boutons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-[#f18832] hover:bg-[#f09d59] cursor-pointer flex items-center justify-center gap-2 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i> Remplacer les médias et
                      mettre à jour
                    </>
                  )}
                </button>
              </div>

              {(updateError || fieldErrors.submit) && (
                <div className="mt-4">
                  <FieldError>
                    {updateError?.response?.data &&
                      Object.entries(updateError.response.data).map(
                        ([field, messages]) =>
                          messages.map((msg, index) => (
                            <div key={`${field}-${index}`}>
                              {field} : {msg}
                            </div>
                          )),
                      )}
                  </FieldError>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProject;
