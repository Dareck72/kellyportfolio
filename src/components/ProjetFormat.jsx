import { useNavigate } from "react-router-dom";

const ProjectFormat = ({ project, pageset }) => {
  const navigator = useNavigate();
  return (
    <>
      <div className="bg-card rounded-xl border border-custom shadow-custom hover:-translate-y-2 transition-transform duration-300 overflow-hidden animate-fade-in">
        <img
          src={project.image_globale}
          alt={project.titre}
          className="w-full h-48 object-cover"
        />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <i className="fas fa-folder text-primary"></i>
            <h3 className="text-lg font-semibold text-white">
              {project.titre}
            </h3>
          </div>
          <div className="flex gap-4 text-custom-gray text-sm mb-4">
            <span className="flex items-center gap-1">
              <i className="fas fa-user"></i> {project.architect}
            </span>
            <span className="flex items-center gap-1">
              <i className="fas fa-calendar"></i> {project.date}
            </span>
          </div>
          <p className="text-white mb-5 line-clamp-2">
            {project.description.substring(0, 100)}...
          </p>
          <button
            onClick={() => {
              navigator(`/details/${project.id}/${project.titre}`);
            }}
            className=" hover:text-black hover:bg-[#f18832] cursor-pointer  w-full border border-primary text-[#f18832] py-2 rounded-lg transition-colors view-project-btn"
            data-id={project.id}
          >
            View Details
          </button>
        </div>
      </div>
    </>
  );
};

export default ProjectFormat;
