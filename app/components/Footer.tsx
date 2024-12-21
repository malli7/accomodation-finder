import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const links = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Privacy",
      href: "/privacy",
    },
    {
      name: "Terms",
      href: "/terms",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ];
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Acco-Finder Logo"
                  width={10}
                  height={10}
                  className="w-10 h-10"
                />
              </div>
              <span className="text-xl font-bold">Acco-Finder</span>
            </div>
          </Link>
          <nav>
            <ul className="flex flex-wrap justify-center gap-4 md:gap-6">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Acco-Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
