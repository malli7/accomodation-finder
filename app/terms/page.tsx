"use client";

import Image from "next/image";
import Link from "next/link";
import { Book, Scale, FileCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Footer from "@/app/components/Footer";
import Nav from "@/app/components/Nav";

export default function TermsAndConditionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Nav />

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="md:w-1/2"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Terms and Conditions
                </h1>
                <p className="text-xl mb-8">
                  {"Please read these terms and conditions carefully before using Acco-Finder's services. By accessing or using our platform, you agree to be bound by these terms."}
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <a href="#key-points">View Key Points</a>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="md:w-1/2"
              >
                <Image
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80"
                  alt="Legal document signing"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section id="key-points" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Points</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Book,
                  title: "Service Usage",
                  description:
                    "Guidelines for using Acco-Finder's platform and services responsibly.",
                },
                {
                  icon: Scale,
                  title: "User Responsibilities",
                  description:
                    "Your obligations as a user of our platform, including content posting rules.",
                },
                {
                  icon: FileCheck,
                  title: "Intellectual Property",
                  description:
                    "Protection of Acco-Finder's intellectual property and user-generated content.",
                },
                {
                  icon: AlertCircle,
                  title: "Limitation of Liability",
                  description:
                    "Our liability limitations and your acknowledgment of potential risks.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6 flex flex-col items-center text-center h-full">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Detailed Terms
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-semibold mb-4">
                  1. Acceptance of Terms
                </h3>
                <p className="text-gray-600 mb-6">
                  By accessing or using Acco-Finder, you agree to comply with
                  and be bound by these Terms and Conditions. If you do not
                  agree to these terms, please do not use our services.
                </p>
                <h3 className="text-2xl font-semibold mb-4">
                  2. User Accounts
                </h3>
                <p className="text-gray-600 mb-6">
                  You are responsible for maintaining the confidentiality of
                  your account and password. You agree to accept responsibility
                  for all activities that occur under your account.
                </p>
                <h3 className="text-2xl font-semibold mb-4">3. Content</h3>
                <p className="text-gray-600">
                  Users are solely responsible for the content they post on
                  Acco-Finder. We reserve the right to remove any content that
                  violates these terms or is otherwise objectionable.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80"
                  alt="Legal documents and laptop"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg mb-8"
                />
                <h3 className="text-2xl font-semibold mb-4">
                  4. Intellectual Property
                </h3>
                <p className="text-gray-600 mb-6">
                  The content, features, and functionality of Acco-Finder are
                  owned by us and are protected by international copyright,
                  trademark, patent, trade secret, and other intellectual
                  property laws.
                </p>
                <h3 className="text-2xl font-semibold mb-4">
                  5. Limitation of Liability
                </h3>
                <p className="text-gray-600">
                  Acco-Finder and its affiliates will not be liable for any
                  indirect, incidental, special, consequential or punitive
                  damages resulting from your use of the service or any related
                  matter.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                Questions About Our Terms?
              </h2>
              <p className="text-xl max-w-2xl mx-auto mb-8">
                {
                  "If you have any questions about these Terms and Conditions, please don't hesitate to contact us."
                }
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
