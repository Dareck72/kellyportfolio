import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MediaFormat from "./mediaFormat";
import Skeleton from "./Skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchway, faCalendarAlt, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import HorizontalScroll from "./H";

const DetailBody = ({ project, isPending }) => {
  const navigator = useNavigate();
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  // 🟡 État loading global
  if (isPending || !project) {
    return (
      <div id="projectPresentationPage" className="pt-16">
        <div className="banner-container">
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="bg-darker py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="h-8 w-56">
              <Skeleton className="h-8 w-56" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-8">
          <section className="mb-12">
            <div className="mb-6">
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card-dark rounded-xl border border-custom p-6">
                <div className="flex items-center mb-6">
                  <Skeleton className="h-6 w-6 mr-4" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <div className="flex items-center mb-6">
                  <Skeleton className="h-6 w-6 mr-4" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <div className="flex items-center mb-6">
                  <Skeleton className="h-6 w-6 mr-4" />
                  <Skeleton className="h-6 w-40" />
                </div>
              </div>

              <div className="bg-card-dark rounded-xl border border-custom p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </section>

          <section className="mb-16">
            <Skeleton className="h-6 w-48 mb-6" />
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              id="projectGallery"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card-dark rounded-lg p-4">
                  <Skeleton className="h-40 w-full" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div id="projectPresentationPage" className="pt-0">
      {/* ================= BANNER ================= */}
      <div className="banner-container relative">
        {/* Skeleton tant que l'image n'est pas prête */}
        {!bannerLoaded && !bannerError && (
          <Skeleton className="h-64 w-full absolute top-0 left-0" />
        )}

        <img
          src={project.image_globale}
          alt={`Bannière du projet ${project.titre}`}
          className={`project-banner w-full h-auto max-h-[60vh] transition-opacity duration-500 ${
            bannerLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setBannerLoaded(true)}
          onError={() => setBannerError(true)}
        />

        {/* Fallback si image cassée */}
        {bannerError && (
          <div className="h-64 flex items-center justify-center bg-card-dark text-gray-400">
            Image indisponible
          </div>
        )}
      </div>

      {/* ================= TITLE ================= */}
      <div className="bg-darker py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-primary text-2xl md:text-3xl font-bold">
            {project.titre}
          </h1>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <section className="mb-12">
          <button
            onClick={() => navigator("/")}
            className="cursor-pointer flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-all duration-300 hover:-translate-y-1"
          >
            Back to Home
          </button>

          <div className="flex flex-col mx-auto items-end gap-8 mt-8">
            {/* Infos */}
            <div className="bg-card-dark w-full rounded-xl border border-custom  py-6">
              <InfoRow
                icon={faArchway}
                label="Architect's name:"
                value={project.architect}
              />
              <InfoRow
                icon={faEnvelope}
                label="Architect's Mail:"
                value={project.email_architect}
              />
              <InfoRow
                icon={faCalendarAlt}
                label="Date:"
                value={project.date_realisation.toString().substring(0, 10)}
              />
            </div>

            {/* Description */}
            <div className="rounded-xl p-6 overflow-auto">
              <Divider />
              <h3 className="text-white text-3xl font-light mb-4">
                Description
              </h3>
              <p className="text-custom-gray mb-6">
                {project.description}
              </p>

              <Divider />

              <h3 className="text-white text-3xl font-light mb-4">
                Contributions on this project
              </h3>
              {project.contributions.map((c, i) => (
                <div key={i} className="flex items-center mb-3">
                  <i className="fas fa-dot-circle text-white mr-3"></i>
                  <span className="text-white">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= GALLERY ================= */}
        <section className="mb-16">
          <h3 className="text-white text-xl font-light mb-6">
            Project Details
          </h3>
            
<HorizontalScroll >
  {project.medias.map((media, index) => (
      <MediaFormat key={index} media={media} />
  ))}
</HorizontalScroll>






          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.medias.map((media, index) => (
              <MediaFormat key={index} media={media} />
            ))}
          </div> */}
        </section>
      </div>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const InfoRow = ({ icon, label, value }) => (
  <div className="flex px-4 items-center mb-6">
    <div className="text-custom-gray text-2xl mr-4 w-8">
     <FontAwesomeIcon icon={icon} />
    </div>
    <div className="text-custom-gray mr-4 text-lg ">
      {label}
    </div>
    <div className="text-white text-lg font-semibold">
      {value}
    </div>
  </div>
);

const Divider = () => <div className="h-px bg-gray-300 my-6"></div>;

export default DetailBody;
