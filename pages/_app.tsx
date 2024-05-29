import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";

import { Poppins } from "@next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div
        data-theme="light"
        className={`text-[#666666] ${poppins.className} `}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </AuthProvider>
  );
}
