import { ThemeProvider } from "@/components/theme-provider";
import ConvexClientProviderWithClerk from "./ConvexClientProvider";
import { EdgeStoreProvider } from "@/lib/edgestore";

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
            <ThemeProvider defaultTheme="dark" attribute="class" disableTransitionOnChange>{children}</ThemeProvider>
          </EdgeStoreProvider>
        </body>
      </ConvexClientProviderWithClerk>
    </html>
  );
}
