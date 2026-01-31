import { useSite } from "../hooks/useProjects.";
import Projects from "./Projets";
import Loading from "./Loading";
import Error from "./Error";
import { faFacebook, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faSubscript } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HomeBody = ({ pageset }) => {
  const { data, isLoading, error } = useSite();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 py-8">
      <section className="mb-24 md:mb-32 relative">
  {/* Fond décoratif subtil */}
  <div className="absolute top-0 left-0 w-72 h-72  rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
  
  {/* Title avec animation d'apparition */}
  <div className="grid grid-cols-[auto_1fr] items-center gap-6 mb-16 relative">
    <div className="relative group">
      <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-transparent rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <h2 className="relative text-primary text-2xl md:text-4xl font-bold tracking-tight">
        My work as an Architectural Assistant
      </h2>
    </div>
    <div className="relative">
      <div className="h-px bg-gradient-to-r from-white/0 via-white/40 to-white/0 w-full"></div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
    </div>
  </div>

  {/* Main layout avec effet de profondeur */}
  <div className="relative group">
    {/* Effet de bordure animé */}
    <div className="absolute -inset-0.5  from-primary/30 to-blue-400/20 rounded-2xl blur opacity-0 group-hover:opacity-70 transition duration-500"></div>
    
    {/* Contenu principal */}
    <div className="relative   border border-white/10 rounded-2xl  overflow-hidden">
      
      {/* Texture subtile en arrière-plan */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px'
        }}></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 p-8 md:p-14 relative z-10">
        
        {/* Avatar avec effet de survol33333383 783102*/}
        <div className="md:col-span-3 flex justify-center md:justify-start">
          <div className="relative group/avatar">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-blue-400 rounded-full opacity-0 group-hover/avatar:opacity-70 blur transition duration-500"></div>
            <img
              src={data && data[0].avatar}
              alt="Profile"
              className="relative w-44 h-44 md:w-52 md:h-52 rounded-full object-cover border-4 border-white/10 shadow-2xl transition-all duration-500 group-hover/avatar:scale-105 group-hover/avatar:border-primary/30"
            />
            <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover/avatar:border-white/20 animate-spin-slow pointer-events-none"></div>
          </div>
        </div>

        {/* Roles avec animation stagger */}
        <div className="md:col-span-9 items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Architectural Assistant", icon: "🏛️" },
            { title: "Architectural Draftsperson", icon: "📐" },
            { title: "BIM Specialist", icon: "💻" },
            { title: "CEO of BIM VOX", icon: "👔" },
          ].map((role, index) => (
            <div 
              key={role.title} 
              className="space-y-4 h-[15vh]  group/role relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center   gap-4">
                <div className="h-px bg-gradient-to-r from-primary to-white/30 w-10 flex-shrink-0"></div>
                <span className="text-2xl opacity-80 group-hover/role:scale-110 group-hover/role:opacity-100 transition-all duration-300">{role.icon}</span>
              </div>
              <p className="text-white text-lg font-semibold leading-tight pl-14 group-hover/role:text-primary transition-colors duration-300">
                {role.title}
              </p>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover/role:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Socials avec icônes */}
        <div className="md:col-span-12 pt-12 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-white/70 text-sm uppercase tracking-wider font-medium mb-2">Connect with me</p>
              <div className="flex flex-wrap gap-6 text-base">
                {[
                  { name: "Facebook", icon: faFacebook, color: "hover:text-blue-400", link: "https://www.facebook.com/kelly.dossou.969" },
                  { name: "LinkedIn", icon: faLinkedin, color: "hover:text-blue-500", link: "https://www.linkedin.com/in/dossou-kelly?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
                  { name: "Instagram", icon: faInstagram, color: "hover:text-pink-500", link: "https://www.instagram.com/kelly_dossou?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
                  { name: "Substack", icon: faSubscript, color: "hover:text-orange-400", link: "#" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.link}
                    className={`flex items-center gap-3 text-white/80 ${social.color} transition-all duration-300 group/social`}
                  >
                    <span className="text-xl group-hover/social:scale-125 transition-transform duration-300">
                      <FontAwesomeIcon icon={social.icon} />
                    </span>
                    <span className="relative">
                      {social.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current group-hover/social:w-full transition-all duration-300"></span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Badge de statut */}
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-white/80">Open to collaboration</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>


        <section className="mb-12">
          <div className="bg-card-dark rounded-xl border border-custom animate-fade-in">
            <div className="bg-card px-6 py-4 border-b border-custom">
              <h3 className="text-primary text-xl font-semibold">Preface</h3>
            </div>
            <div className="p-6 leading-relaxed text-white">
              <p className="mb-4">
                {data && data[0].description}
              </p>
              {/* <button className="text-primary font-semibold hover:underline transition-colors">
                Show more
              </button> */}
            </div>
          </div>
        </section>

        <Projects pageset={pageset} />
      </div>
    </>
  );
};
// style
export default HomeBody;
