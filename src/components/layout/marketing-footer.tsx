import Link from 'next/link';

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Colonne 1: Liens rapides */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Liens rapides
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/a-propos"
                  className="transition-colors hover:text-white"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-white"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/mentions-legales"
                  className="transition-colors hover:text-white"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="transition-colors hover:text-white"
                >
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 2: Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contact@formelio.fr"
                  className="transition-colors hover:text-white"
                >
                  Email: contact@formelio.fr
                </a>
              </li>
              <li className="text-gray-500">Phone: to be added</li>
              <li className="text-gray-500">Address: to be added</li>
            </ul>
          </div>

          {/* Colonne 3: Logo + Tagline */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <svg
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M5 12L10 7L11.5 8.5L8 12L11.5 15.5L10 17L5 12Z"
                  fill="currentColor"
                />
                <path
                  d="M13 12L18 7L19.5 8.5L16 12L19.5 15.5L18 17L13 12Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-xl font-heading font-bold text-white">
                FORMELIO
              </span>
            </div>
            <p className="text-sm italic">Votre temps, notre priorité</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
          <p>© {currentYear} Formelio. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
