"use client";

import {
  MessageCircle,
  User,
  LogOut,
  Menu,
  Users,
  Building2,
  Plus,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DialogTitle } from "@/components/ui/dialog";
import { useClerk } from "@clerk/nextjs";
import { useUnseenMessage } from "@/app/(application)/UnseenMessageContext";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { unseenCount } = useUnseenMessage();

  const isActive = (path: string) => pathname === path;

  const handleSignOut = async () => {
    router.push("/");
    await signOut();
  };

  const NavItem = ({
    href,
    icon: Icon,
    label,
    count,
  }: {
    href: string;
    icon: React.ElementType;
    label: string;
    count?: number;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href}>
            <Button
              variant={isActive(href) ? "default" : "ghost"}
              size="icon"
              className={`${
                isActive(href) ? "bg-primary text-primary-foreground" : ""
              } relative`}
            >
              <Icon className="w-5 h-5" />

              {count && count > 0 ? (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
                  {count}
                </span>
              ) : (
                ""
              )}
              {isActive(href) && (
                <span className="absolute bottom-0 left-1/2 w-1 h-1 bg-primary-foreground rounded-full transform -translate-x-1/2 translate-y-1/2" />
              )}
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const NavItems = () => (
    <>
      <NavItem href="/add-listing" icon={Plus} label="Add Listing" />
      <NavItem href="/home" icon={Building2} label="Accommodations" />
      <NavItem href="/community" icon={Users} label="Community" />
      <NavItem
        href="/chat"
        icon={MessageCircle}
        label="Chat"
        count={unseenCount}
      />
      <NavItem href="/offers" icon={Tag} label="Offers" />
      <NavItem href="/profile" icon={User} label="Profile" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Logout</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );

  const MobileNavItems = () => (
    <>
      <Link href="/add-listing" className="flex items-center space-x-2 py-2">
        <Plus className="w-5 h-5" />
        <span>Add Listing</span>
      </Link>
      <Link href="/home" className="flex items-center space-x-2 py-2">
        <Building2 className="w-5 h-5" />
        <span>Accommodations</span>
      </Link>
      <Link href="/community" className="flex items-center space-x-2 py-2">
        <Users className="w-5 h-5" />
        <span>Community</span>
      </Link>
      <Link href="/chat" className="flex items-center space-x-2 py-2">
        <MessageCircle className="w-5 h-5" />
        <span>Chat</span>
      </Link>
      <Link href="/offers" className="flex items-center space-x-2 py-2">
        <Tag className="w-5 h-5" />
        <span>Offers</span>
      </Link>
      <Link href="/profile" className="flex items-center space-x-2 py-2">
        <User className="w-5 h-5" />
        <span>Profile</span>
      </Link>
      <Button
        variant="ghost"
        className="flex items-center space-x-2 w-full justify-start py-2"
        onClick={handleSignOut}
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </Button>
    </>
  );

  return (
    <header className="bg-background shadow-md sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img src={"/logo.png"} className="w-10 h-10" />
            <span className="text-2xl font-bold text-primary">Acco-Finder</span>
          </Link>
          <div className="hidden md:flex items-center space-x-2">
            <NavItems />
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <DialogTitle>Menu</DialogTitle>
              <div className="flex flex-col space-y-4 mt-4">
                <MobileNavItems />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
