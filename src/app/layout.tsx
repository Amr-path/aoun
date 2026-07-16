import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Alexandria } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { BRAND } from "@/lib/constants";
import SWRegister from "@/components/SWRegister";
import Toaster from "@/components/ui/Toaster";

// الجسم: IBM Plex Sans Arabic — حيادٌ نظاميّ دقيق بروح SF Arabic.
const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// العناوين: Alexandria — خطٌّ عربيّ هندسيّ معاصر: ودودٌ دون طفولية.
const display = Alexandria({
  variable: "--font-display-arabic",
  subsets: ["arabic"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "عون رفيقك للاستمرار: سبع عادات فقط طوال العام، لأقصى تركيز وثبات على المدى الطويل.",
  applicationName: BRAND.name,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: BRAND.name,
  },
};

export const viewport: Viewport = {
  // يطابق خلفية التطبيق: كريميّ فاتح، وداكن «الغسق» — فلا يبقى شريط الحالة كريمياً ليلاً.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme =
    (await cookies()).get("aoun-theme")?.value === "dusk" ? "dusk" : undefined;

  return (
    <html
      lang="ar"
      dir="rtl"
      data-theme={theme}
      className={`${arabic.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SWRegister />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
