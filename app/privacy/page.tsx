"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield, Lock, Eye, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Footer from "@/app/components/Footer";
import Nav from "@/app/components/Nav";

export default function PrivacyPage() {
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
                Privacy Policy
              </h1>
              <p className="text-xl text-center text-muted-foreground max-w-3xl mx-auto mb-12">
                At Acco-Finder, we are committed to protecting your privacy and
                ensuring the security of your personal information.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
                  alt="Data privacy concept"
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
                <h2 className="text-3xl font-semibold mb-6">
                  Our Commitment to You
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  We understand the importance of your personal data and are
                  dedicated to maintaining its confidentiality. Our privacy
                  policy outlines how we collect, use, and protect your
                  information when you use our platform.
                </p>
                <ul className="space-y-4">
                  {[
                    { icon: Shield, text: "Data Protection" },
                    { icon: Lock, text: "Secure Transactions" },
                    { icon: Eye, text: "Transparency" },
                    { icon: FileText, text: "Clear Policies" },
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
              Key Privacy Principles
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Data Collection",
                  description:
                    "We only collect information that is necessary to provide you with our services and improve your experience on our platform.",
                  image:
                    "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=800&q=80",
                },
                {
                  title: "Data Usage",
                  description:
                    "Your information is used solely for the purpose of providing and improving our services. We never sell your data to third parties.",
                  image:
                    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80",
                },
                {
                  title: "Data Security",
                  description:
                    "We employ industry-standard security measures to protect your data from unauthorized access, disclosure, alteration, and destruction.",
                  image:
                    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="overflow-hidden h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={200}
                        className="rounded-lg mb-4 object-cover h-48 w-full"
                      />
                      <h3 className="text-xl font-semibold mb-2">
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
              <h2 className="text-3xl font-bold mb-6">Your Rights</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                We respect your rights regarding your personal data. You have
                the right to access, correct, or delete your information at any
                time.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" asChild>
                <Link href="/contact">
                  Contact Us for Privacy Concerns
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
