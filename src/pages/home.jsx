import Navigation from "../components/Nav";
import Carousel from "../components/Caroussel";
import HomeBody from "../components/Profile";




function Home() {
 
 const medias = [
  {
      img_path: "/Bus_station_Project_.png",
    },
  {
      img_path: "/Event_organisation_.png",
    },
  {
      img_path: "/Mini-Hotel_Project_Design_.png",
    },
     {
      img_path: "/Residential_project_in_Cotonou_.png",
    },
    
    {
      img_path: "/FIFAHouse.png",
    },
    {
      img_path: "/Image1.png",
    },
    {
      img_path: "/Image2.png",
    },
       {
      img_path: "/Greenhouse.png",
    },
  ];
  return (
    <>
      <Navigation />
     <Carousel medias={medias} autoDelay={3000} />
      <HomeBody />
    </>
  );
}

export default Home;
