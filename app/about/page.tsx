"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Users2,
  MessageCircle,
  Users,
  ArrowRight,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Footer from "@/app/components/Footer";
import Nav from "@/app/components/Nav";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
                About Acco-Finder
              </h1>
              <p className="text-xl text-center text-muted-foreground max-w-3xl mx-auto mb-12">
                Empowering Indian students in the USA with seamless housing
                solutions and a supportive community network.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="Students collaborating"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                 {" At Acco-Finder, we're on a mission to revolutionize the way Indian students in the USA find housing and build their support networks. We understand the challenges of studying abroad, and we're here to make your journey smoother, more connected, and ultimately more successful. "}
                </p>
                <ul className="space-y-4">
                  {[
                    { icon: Building2, text: "Verified Housing Solutions" },
                    { icon: Users2, text: "Collaborative Study Groups" },
                    { icon: MessageCircle, text: "Organized Communication" },
                    { icon: Users, text: "Supportive Community" },
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-lg">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Journey
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  year: "2024 October",
                  title: "The Idea",
                  description:
                    "Acco-Finder was born from the personal struggles of its founder, an Indian student navigating the complexities of studying in the USA.",
                  image:
                    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
                },
                {
                  year: "2024 November",
                  title: "Launch & Growth",
                  description:
                    "We launched our platform, quickly gaining traction among Indian students across major US universities.",
                  image:
                    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
                },
                {
                  year: "2024 December",
                  title: "Expanding Horizons",
                  description:
                    "Acco-Finder continues to evolve, adding new features and expanding to more cities to serve a growing user base.",
                  image:
                    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="relative overflow-hidden group h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full group-hover:bg-blue-200 transition-colors duration-300" />
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={200}
                        className="rounded-lg mb-4 object-cover h-48 w-full"
                      />
                      <span className="text-4xl font-bold text-blue-200 group-hover:text-blue-300 transition-colors duration-300">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-semibold mt-4 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground flex-grow">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">Meet the Developer</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Acco-Finder is brought to you by a passionate developer who
                understands the challenges of studying abroad firsthand.
              </p>
            </motion.div>
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80"
                alt="Developer portrait"
                width={200}
                height={200}
                className="rounded-full border-4 border-white shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-semibold mb-2">Mallikarjuna</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Full Stack Developer & Founder
              </p>
              <div className="flex justify-center gap-4 mb-8">
                <Link
                  href="https://github.com/malli7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="icon">
                    <GitHubLogoIcon />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </Link>
                <Link
                  href="https://www.linkedin.com/in/mallikarjuna-reddy-gayam/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="icon">
                    <LinkedInLogoIcon />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </Link>
                <Link
                  href="https://x.com/mallireddy0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="icon">
                    <XIcon />

                    <span className="sr-only">Twitter</span>
                  </Button>
                </Link>
              </div>
              <Button size="lg" asChild>
                <Link
                  href="https://www.mallikarjuna-portfolio.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Developer Portfolio
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
