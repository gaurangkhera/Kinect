import ConvexClientProviderWithClerk from "./ConvexClientProvider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "Kinect - Connect with friends, family and everyone else.",
    template: "Kinect | %s"
  },
  description: 'Kinect is your favorite social media platform, but better. Connect with friends, family and more.',
}

const font = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <ConvexClientProviderWithClerk>
        <body className={font.className}>
          <EdgeStoreProvider>
            {children}
          </EdgeStoreProvider>
        </body>
      </ConvexClientProviderWithClerk>
    </html>
  );
}
