import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Noto_Kufi_Arabic } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { BRAND } from "@/lib/constants";
import SWRegister from "@/components/SWRegister";

// الخط الأساسي: ينسجم مع اللاتيني ويعطي إحساساً راقياً
const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// خط العناوين — كوفيّ راقٍ يمنح حضوراً تحريرياً هادئاً
const display = Noto_Kufi_Arabic({
  variable: "--font-display",
  subsets: ["arabic", "latin"],
  weight: ["600", "700", "800"],
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
  themeColor: "#faf6f0",
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
      className={`${arabic.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SWRegister />
        {children}
      </body>
    </html>
  );
}
