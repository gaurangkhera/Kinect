import { ThemeProvider } from "@/components/theme-provider";
import ConvexClientProviderWithClerk from "./ConvexClientProvider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "Kinect - Connect with friends, family and everyone else.",
    template: "%s | Kinect"
  },
  description: 'Zephyr is a blend of a freelancing like Fiverr and Upwork, and a business-focused social media platform such as Linkedin.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <ConvexClientProviderWithClerk>
        <body>
          <EdgeStoreProvider>
            {children}
          </EdgeStoreProvider>
        </body>
      </ConvexClientProviderWithClerk>
    </html>
  );
}
