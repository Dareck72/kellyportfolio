import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../components/Nav";
import { api } from "../api/axios";
import { useQueryClient } from "@tanstack/react-query";
import FieldError from "../components/FieldError";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get(`/projects/${id}/`);
        if (!mounted) return;
        setProject(data);
      } catch (err) {
        setError("Impossible de charger le projet");
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [id]);

  const handleChange = (e) => {
    const { id: key, value } = e.target;
    setProject((p) => ({ ...p, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put(`/projects/update/${id}/`, project);
      await queryClient.invalidateQueries(["users"]);
      navigate("/admin");
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Navigation />;

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-card-dark p-6 rounded-lg">
          <h2 className="text-xl text-white mb-4">Modifier le projet</h2>
          {error && <FieldError>{error}</FieldError>}
          <form onSubmit={handleSave}>
            <div className="mb-4">
              <label className="block text-custom-gray mb-2">Titre</label>
              <input
                id="titre"
                value={project.titre || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-white/5 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-custom-gray mb-2">Architect</label>
              <input
                id="architect"
                value={project.architect || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-white/5 text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary px-4 py-2 rounded text-white"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="bg-gray-600 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProject;
