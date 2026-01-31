import { useRef, useState } from "react";
import Navigation from "./Nav";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/auth";
import FieldError from "./FieldError";
import FormOverlay from "./FormOverlay";

const Connexion = () => {
  const navigator = useNavigate();
  const formref = useRef(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const { mutate, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errors = {};
    if (!email) errors.email = "Email requis";
    if (!password) errors.password = "Mot de passe requis";
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    mutate(
      { email, password },
      {
        onSuccess: () => navigator("/admin"),
      },
    );
  };

  return (
    <>
      <Navigation />

      <div
        id="connectionPage"
        className=" min-h-screen flex items-center justify-center bg-dark p-4"
      >
        <div className="bg-card-dark rounded-xl shadow-custom border border-custom max-w-md w-full overflow-hidden">
          <div className="bg-primary text-white text-center py-5 text-2xl font-semibold">
            Connection
          </div>
          <div className="p-6 md:p-8">
            <form ref={formref} onSubmit={handleSubmit} id="loginForm">
              <div className="mb-6">
                <label className="block text-custom-gray mb-2">Username:</label>
                <input
                  type="text"
                  id="email"
                  required
                  autoComplete="username"
                  className="w-full bg-white/5 border border-custom rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                />
                {fieldErrors.email && (
                  <FieldError>{fieldErrors.email}</FieldError>
                )}
              </div>
              <div className="mb-8">
                <label className="block text-custom-gray mb-2">Password:</label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    required
                    autoComplete="password"
                    className="w-full bg-white/5 border border-custom rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-custom-gray"
                    id="togglePassword"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  {fieldErrors.password && (
                    <FieldError>{fieldErrors.password}</FieldError>
                  )}
                </div>
              </div>
              <div className="relative">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Log in</span>
                  )}
                </button>
                <FormOverlay loading={isPending} />
              </div>
              {error && <FieldError>{error?.message || error?.detail|| 'Erreur de connexion'}</FieldError>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Connexion;
