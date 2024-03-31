import { ThemeProvider } from "@/components/theme-provider";
import ConvexClientProviderWithClerk from "./ConvexClientProvider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "Kinect - Connect with friends, family and everyone else.",
    template: "Kinect | %s"
  },
  description: 'Kinect is your favorite social media platform, but better. Connect with friends, family and more.',
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
