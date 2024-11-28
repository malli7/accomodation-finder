"use client";

import NavBar from "@/app/components/homePageComponents/NavBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreditCard,
  Gift,
  GraduationCap,
  ShoppingBag,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Offer {
  id: number;
  title: string;
  description: string;
  category: string;
  discount: string;
  image?: string;
  badge?: {
    text: string;
    color: string;
  };
  icon?: string;
  link: string;
}

interface FeaturedBanner {
  title: string;
  description: string;
  image: string;
  link: string;
}

export default function OffersPage() {
  const [featuredOffers, setFeaturedOffers] = useState<Offer[]>([]);
  const [additionalOffers, setAdditionalOffers] = useState<Offer[]>([]);
  const [featuredBanner, setFeaturedBanner] = useState<FeaturedBanner | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch("/api/offers");
        if (!res.ok) {
          throw new Error("Failed to fetch offers");
        }
        const data = await res.json();
        console.log(data);
        setFeaturedOffers(data.featuredOffers);
        setAdditionalOffers(data.additionalOffers);
        setFeaturedBanner(data.featuredBanner);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOffers();
  }, []);

  const iconMap: { [key: string]: React.ElementType } = {
    GraduationCap,
    ShoppingBag,
    Tag,
    Gift,
    CreditCard,
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800">
        <div className="text-center text-white">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <p className="mt-4 text-lg">Loading amazing student offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
      <NavBar />
      {/* Hero Section */}
      <section className="px-4 py-20 text-center text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="animate-fade-up">
            <Badge
              className="mb-4 bg-white/10 text-white hover:bg-white/20"
              variant="secondary"
            >
              🎉 Exclusive Student Offers
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Unlock Amazing Deals for Students
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
              Discover unbeatable discounts on credit cards, brand offers, and
              special promotions tailored just for students in the USA.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      {featuredBanner && (
        <section className="px-4 py-6 sm:py-8 md:py-12">
        <div className="container mx-auto max-w-6xl">
          <Card className="group relative overflow-hidden transition-all hover:scale-105">
            <CardHeader className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
              <Image
                src={featuredBanner.image}
                alt="Special Student Offer"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80" />
              <div className="absolute inset-0 flex flex-col items-start justify-center p-4 sm:p-6 md:p-8 text-white">
                <Badge className="mb-2 bg-yellow-500 text-yellow-950 text-xs sm:text-sm">
                  Featured Offer
                </Badge>
                <h2 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold">
                  {featuredBanner.title}
                </h2>
                <p className="mb-4 max-w-md text-sm sm:text-base md:text-lg">
                  {featuredBanner.description}
                </p>
  
                <Link
                  className="w-full sm:w-auto"
                  href={featuredBanner.link || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>
      )}

      {/* Featured Offers */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-white md:text-3xl">
            Featured Offers
          </h2>
          <div className="mb-12 flex overflow-x-auto py-8 gap-6 px-4">
            {featuredOffers.map((offer) => (
              <Card
                key={offer.id}
                className="flex-shrink-0 w-80 group relative overflow-hidden transition-all hover:scale-105 hover:z-10 rounded-xl"
              >
                <div className="relative z-0 transition-all group-hover:transform group-hover:scale-105">
                  <CardHeader className="relative h-48">
                    {offer.image && (
                      <Image
                        src={offer.image}
                        alt={offer.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    {offer.badge && (
                      <Badge
                        className={`absolute right-4 top-4 ${offer.badge.color}`}
                      >
                        {offer.badge.text}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {iconMap[offer.category] &&
                          React.createElement(iconMap[offer.category], {
                            className: "h-4 w-4",
                          })}
                        {offer.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {offer.discount}
                      </span>
                    </div>
                    <CardTitle className="mb-2">{offer.title}</CardTitle>
                    <CardDescription className="mb-4">
                      {offer.description}
                    </CardDescription>
                    <Link
                      className="w-full"
                      href={offer.link || ""}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full">Claim Offer</Button>
                    </Link>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional Offers Section */}
          <div className="space-y-6">
            <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
              More Ways to Save
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {additionalOffers.map((offer) => (
                <Card
                  key={offer.id}
                  className="group overflow-hidden transition-all hover:scale-105"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-48 w-full sm:w-1/3">
                      <Image
                        src={
                          offer.image || "/placeholder.svg?height=200&width=200"
                        }
                        alt={offer.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-6">
                      <div className="mb-2 flex items-center justify-between">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {offer.icon &&
                            iconMap[offer.icon] &&
                            React.createElement(iconMap[offer.icon], {
                              className: "h-4 w-4",
                            })}
                          {offer.category}
                        </Badge>
                        <Badge
                          variant="destructive"
                          className="text-sm font-bold"
                        >
                          {offer.discount}
                        </Badge>
                      </div>
                      <CardTitle className="mb-2">{offer.title}</CardTitle>
                      <CardDescription className="mb-4">
                        {offer.description}
                      </CardDescription>
                      <Link
                        className="w-full"
                        href={offer.link || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="w-full">
                          Learn More
                        </Button>
                      </Link>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50"
            >
              promote an offer
              <span className="animate-bounce">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
