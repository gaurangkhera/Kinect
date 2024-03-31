import { ThemeProvider } from "@/components/theme-provider";
import '@/app/globals.css'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider defaultTheme="dark" disableTransitionOnChange attribute="class">
            <div>{children}</div>
        </ThemeProvider>
    )
}