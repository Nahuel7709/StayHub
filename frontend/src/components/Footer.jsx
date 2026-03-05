import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-border bg-card">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-4">
            <img
              src="/StayHub-isologo.svg"
              alt="StayHub"
              className="h-10 w-auto"
            />
          </Link>
          <div className="socials flex gap-2 items-center">
            <Link
              to="https://www.instagram.com/"
              className="flex items-center gap-4"
              target="blank"
            >
              <img
                src="/instagram.svg"
                alt="StayHub"
                className="h-8 w-auto shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              />
            </Link>
            <Link
              to="https://www.linkedin.com/"
              className="flex items-center gap-4"
              target="blank"
            >
              <img
                src="/linkedin.svg"
                alt="StayHub"
                className="h-7 w-auto shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              />
            </Link>
            <Link
              to="https://www.facebook.com/"
              className="flex items-center gap-4"
              target="blank"
            >
              <img
                src="/facebook.svg"
                alt="StayHub"
                className="h-7 w-auto shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              />
            </Link>
          </div>
        </div>

      
        <div className="text-sm text-secondary/70">
          © {year} StayHub. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
