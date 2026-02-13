import Admin from "./components/Admin.jsx";
import Connexion from "./components/connexion.jsx";
import ProjectForm from "./components/ProjectForm.jsx";
import Home from "./pages/home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { refreshToken } from "./api/refresh";
import { useEffect } from "react";
import DetailsProjectPage from "./pages/DetailProject.jsx";
import EditProject from "./pages/EditProject.jsx";
import Fouter from "./components/Footer.jsx";

const queryClient = new QueryClient(); // ✅ INSTANCE

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/admin", element: <Admin /> },
  { path: "/connexion", element: <Connexion /> },
  { path: "/create-project", element: <ProjectForm /> },
  { path: "/edit-project/:id", element: <EditProject /> },
  { path: "details/:id/:title", element: <DetailsProjectPage /> },
  { path: "*", element: <Home /> },
]);

function App() {
  useEffect(() => {
    console.log("refreshing");
    refreshToken().catch(() => {
      console.log("Refresh failed, logout user");
      localStorage.clear();
    });

    const interval = setInterval(() => {
      console.log("refreshing");
      const a = refreshToken().catch(() => {
        console.log("Refresh failed, logout user");
        localStorage.clear();
      });
      console.log(a);
    }, 100000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Fouter />
    </QueryClientProvider>
  );
}

export default App;
