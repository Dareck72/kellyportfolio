import Navigation from "../components/Nav";
import Carroussel from "../components/Caroussel";
import HomeBody from "../components/Profile";
import DetailBody from "../components/DetailBody";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { useProjects } from "../hooks/useProjects.";
import { useParams } from "react-router-dom";

function DetailsProjectPage() {
  const { data, isPending, error } = useProjects();
  const { id, title } = useParams();

  // if (error) {
  //   return (
  //     <>
  //       <Navigation />
  //       <Error message={error.message} />
  //     </>
  //   );
  // }

  const project = data && data.find((p) => p.id == parseInt(id));

  // if (!project) {
  //   return (
  //     <>
  //       <Navigation />
  //       <Error message="Project not found" />
  //     </>
  //   );
  // }

  return (
    <>
      <Navigation />
      <DetailBody project={project} isPending={isPending} />
    </>
  );
}

export default DetailsProjectPage;
