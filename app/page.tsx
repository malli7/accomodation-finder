import Link from "next/link";
import {
  Home,
  Users,
  MessageCircle,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

interface StepCardProps {
  number: number;
  title: string;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
}

const Features = [
  {
    icon: <Home className="w-12 h-12 text-blue-500" />,
    title: "Organized Housing Search",
    description:
      "No more scrolling through endless messages. Find your perfect home with our structured listings.",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: <Users className="w-12 h-12 text-blue-500" />,
    title: "Verified Community",
    description:
      "Say goodbye to spam and fake profiles. Connect with real peers who've got your back.",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: <MessageCircle className="w-12 h-12 text-blue-500" />,
    title: "Focused Discussions",
    description:
      "No more off-topic chatter. Get answers and advice in dedicated forums.",
    image:
      "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: <UserPlus className="w-12 h-12 text-blue-500" />,
    title: "Expand Your Network",
    description:
      "Build meaningful connections beyond random group chats. Your future best friend or job referral is here.",
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
  },
];

function FeatureCard({ icon, title, description, image }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up">
      <div className="w-full h-48 mb-6 overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={title}
          width={800}
          height={400}
          className="fill-current w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="bg-blue-100 p-4 rounded-full mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({ number, title }: StepCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center flex-1 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up">
      <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
        {number}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
}

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-black">
      <section className="relative bg-gradient-to-b from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center space-x-2 z-10">
              <Image alt="logo" width={50} height={50} src={"/logo.png"} />
              <span className="text-3xl font-bold text-white">Acco-Finder</span>
            </Link>
          </div>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
              Ditch the WhatsApp Chaos. Welcome to Your Ultimate Support Hub!
            </h1>
            <p className="text-xl sm:text-2xl mb-8 opacity-90 animate-fade-in-up animation-delay-200">
              The all-in-one platform for Indian students in the USA. Find
              housing, build your network, and get the support you need - all in
              one place.
            </p>
            <Link
              href="/home"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-100 transition duration-300 inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-fade-in-up animation-delay-400"
            >
              Join Now
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in-up">
            Why Acco-Finder Crushes WhatsApp Groups
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                image={feature.image}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Acco-Finder Transforms Your Experience
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-4">
            <StepCard
              number={1}
              title="Create your profile and join a thriving community"
            />
            <ArrowRight className="hidden md:block w-8 h-8 text-blue-300" />
            <StepCard
              number={2}
              title="Access curated listings and expert advice"
            />
            <ArrowRight className="hidden md:block w-8 h-8 text-blue-300" />
            <StepCard
              number={3}
              title="Connect, settle in, and thrive in your new home"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">
            Ready to Upgrade Your Student Life?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {
              "Don't waste another minute in chaotic WhatsApp groups. Join Acco-Finder now and experience the future of student networking and support."
            }
          </p>
          <Link
            href="/home"
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-100 transition duration-300 inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Your Journey Now
          </Link>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Explore Acco-Finder</h3>
              <nav>
                <ul className="space-y-2">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/about", label: "About" },
                    { href: "/privacy", label: "Privacy" },
                    { href: "/terms", label: "Terms" },
                    { href: "/contact", label: "Contact" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-blue-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Get in Touch</h3>
              <p className="text-gray-300">Email: accofinder0@gmail.com</p>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/people/Acco-Finderr/61571678853106/"
                className="text-white hover:text-blue-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/accofinder0/"
                className="text-white hover:text-blue-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://x.com/accofinder0"
                className="text-white hover:text-blue-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717  l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339  l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/acco-finder/"
                className="text-white hover:text-blue-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-linkedin"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2025 Acco-Finder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
