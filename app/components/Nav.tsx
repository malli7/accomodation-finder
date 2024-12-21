"use client";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Nav = () => {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
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
  const NavLinks = () => (
    <ul className="flex flex-col md:flex-row gap-6">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={`${
              pathname === link.href
                ? "text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            } transition-colors`}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
  return (
    <header className="border-b sticky top-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={"/"} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Acco-Finder Logo"
              width={10}
              height={10}
              className="w-10 h-10"
            />
          </div>
          <span className="text-xl font-bold text-blue-600">Acco-Finder</span>
        </Link>
        {isMobile ? (
          <Sheet>
            <DialogTitle></DialogTitle>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-bold text-blue-600">
                    Acco-Finder
                  </span>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetTrigger>
                </div>
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav>
            <NavLinks />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Nav;
