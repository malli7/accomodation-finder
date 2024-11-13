import Link from "next/link";
import { Home, Users, MessageCircle, UserPlus, ArrowRight } from "lucide-react";

export default function EnhancedHomepage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-black">
      <section className="relative bg-gradient-to-b from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center space-x-2 z-10">
              <img src={"/logo.png"} className="w-10 h-10" />
              <span className="text-3xl font-bold text-white">DesiDwaar</span>
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
              Join the Revolution
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in-up">
            Why DesiDwaar Crushes WhatsApp Groups
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <EnhancedFeatureCard
              icon={<Home className="w-12 h-12 text-blue-500" />}
              title="Organized Housing Search"
              description="No more scrolling through endless messages. Find your perfect home with our structured listings."
              image="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            />
            <EnhancedFeatureCard
              icon={<Users className="w-12 h-12 text-blue-500" />}
              title="Verified Community"
              description="Say goodbye to spam and fake profiles. Connect with real peers who've got your back."
              image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
            />
            <EnhancedFeatureCard
              icon={<MessageCircle className="w-12 h-12 text-blue-500" />}
              title="Focused Discussions"
              description="No more off-topic chatter. Get answers and advice in dedicated forums."
              image="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            />
            <EnhancedFeatureCard
              icon={<UserPlus className="w-12 h-12 text-blue-500" />}
              title="Expand Your Network"
              description="Build meaningful connections beyond random group chats. Your future best friend or job referral is here."
              image="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How DesiDwaar Transforms Your Experience
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-4">
            <EnhancedStepCard
              number={1}
              title="Create your profile and join a thriving community"
            />
            <ArrowRight className="hidden md:block w-8 h-8 text-blue-300" />
            <EnhancedStepCard
              number={2}
              title="Access curated listings and expert advice"
            />
            <ArrowRight className="hidden md:block w-8 h-8 text-blue-300" />
            <EnhancedStepCard
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
              "Don't waste another minute in chaotic WhatsApp groups. Join DesiDwaar now and experience the future of student networking and support."
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

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link href={"/home"} className="text-lg font-semibold mb-4">
                Explore DesiDwaar
              </Link>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
              <p>Email: support@desidwaar.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Join Our Community</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-blue-300">
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
                <a href="#" className="text-white hover:text-blue-300">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-blue-300">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface EnhancedFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
}

function EnhancedFeatureCard({
  icon,
  title,
  description,
  image,
}: EnhancedFeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up">
      <div className="w-full h-48 mb-6 overflow-hidden rounded-lg">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="bg-blue-100 p-4 rounded-full mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

interface EnhancedStepCardProps {
  number: number;
  title: string;
}

function EnhancedStepCard({ number, title }: EnhancedStepCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center flex-1 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up">
      <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
        {number}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
}
