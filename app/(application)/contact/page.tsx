"use client";
import emailjs from "@emailjs/browser";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { Send, CheckCircle, HelpCircle, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/app/components/other/Footer";
import Nav from "@/app/components/other/Nav";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //mail to us
    emailjs
      .send(
        "service_dnopx1n",
        "template_4v7c9w7",
        formData,
        "qWDzFPREiUdeMM8hZ"
      )
      .then(
        () => {},
        (error: Error) => {
          console.log(error);

          alert("Ahh, something went wrong. Please try again.");
        }
      );

    //mail to user
    emailjs
      .send(
        "service_dnopx1n",
        "template_faczxvj",
        formData,
        "qWDzFPREiUdeMM8hZ"
      )
      .then(
        () => {
          alert("Thank you. we will get back to you as soon as possible.");

          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
        },
        (error: Error) => {
          console.log(error);

          alert("Ahh, something went wrong. Please try again.");
        }
      );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Nav />

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {
                " Have questions or concerns? We're here to help. Reach out to us and we'll get back to you as soon as possible."
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg"
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[150px]"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  Why Choose Acco-Finder?
                </h2>
                <div className="grid gap-4">
                  {[
                    {
                      icon: CheckCircle,
                      title: "Verified Listings",
                      description:
                        "All our accommodations are thoroughly vetted for quality and safety.",
                    },
                    {
                      icon: HelpCircle,
                      title: "24/7 Support",
                      description:
                        "Our team is always available to assist you with any queries or concerns.",
                    },
                    {
                      icon: MessageCircle,
                      title: "Community Connect",
                      description:
                        "Join our vibrant community of Indian students in the USA.",
                    },
                  ].map((item, index) => (
                    <Card key={index}>
                      <CardContent className="flex items-center p-4">
                        <item.icon className="h-8 w-8 text-blue-600 mr-4" />
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
                <p className="text-gray-600 mb-4">
                  {
                    " At Acco-Finder, we're committed to making your transition to studying in the USA as smooth as possible. Our platform is designed to address the unique challenges faced by Indian students, providing not just accommodation solutions, but a supportive community to help you thrive. "
                  }
                </p>
                <p className="text-gray-600">
                  {
                    " Whether you're looking for housing, seeking advice, or wanting to connect with fellow students, we're here to support you every step of the way. "
                  }
                </p>
              </div>
              <div>
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="Students collaborating"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-md"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
