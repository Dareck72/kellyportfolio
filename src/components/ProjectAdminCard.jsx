// import PropTypes from 'prop-types'

import { useDeleteProject } from "../hooks/useDeleteProject";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const ProjectAdminCard = ({ project, onDeleteRequest, edit }) => {
  const { mutate, isPending: isDeleting } = useDeleteProject();
  const onDelete = () => {
    onDeleteRequest(project);
    mutate(project.id);
  };
  return (
    <div className="flex items-center justify-between p-4 mb-3 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors group">
      <div className="flex items-center gap-4">
        {project.image_globale ? (
          <img
            src={
              typeof project.image_globale === "string"
                ? project.image_globale
                : URL.createObjectURL(project.image_globale)
            }
            alt={project.titre}
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
            <FontAwesomeIcon icon={faImage} className="text-gray-400" />
          </div>
        )}

        <div>
          <h5 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
            {project.titre}
          </h5>
          <p className="text-sm text-gray-600">
            {project.architect} •{" "}
            {new Date(project.date_realisation).getFullYear()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          title="Modifier"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          ) : (
            <FontAwesomeIcon icon={faEdit} />
          )}
        </button> */}

        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          title="Supprimer"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
          ) : (
            <FontAwesomeIcon icon={faTrash} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ProjectAdminCard;
