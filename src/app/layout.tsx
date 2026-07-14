import type { Metadata, Viewport } from "next";
import { Almarai, Lalezar, Amiri } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { BRAND } from "@/lib/constants";
import SWRegister from "@/components/SWRegister";
import Toaster from "@/components/ui/Toaster";

// الجسم: Almarai — عربيٌّ دافئٌ واضح.
const arabic = Almarai({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  display: "swap",
});

// العناوين: Lalezar — خطُّ ملصقاتٍ عربيّ ضخم يليق بالبروتاليزم.
const display = Lalezar({
  variable: "--font-display-arabic",
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
});

// الاقتباسات: Amiri — نسخٌ كلاسيكي يمنح «بذرة اليوم» روح المخطوطة.
const quote = Amiri({
  variable: "--font-quote-arabic",
  subsets: ["arabic"],
  weight: ["400", "700"],
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
    { media: "(prefers-color-scheme: light)", color: "#f5efdd" },
    { media: "(prefers-color-scheme: dark)", color: "#17141d" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
      className={`${arabic.variable} ${display.variable} ${quote.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SWRegister />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
