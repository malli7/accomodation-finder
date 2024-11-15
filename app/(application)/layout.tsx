import type { Metadata } from "next";
import ClerkProviders from "../providers/ClerkProviders";
import { UnseenMessageProvider } from "./UnseenMessageContext";
import MessageListener from "../components/MessageListener";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Acco-Finder",
  description: "Your Gateway to Indian Student Life in the USA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProviders>
      <UnseenMessageProvider>
      <ToastContainer  position="top-right" autoClose={2000} hideProgressBar={true} />

      <MessageListener />

        {children}
        </UnseenMessageProvider>
    </ClerkProviders>
  );
}
