// عون — غلاف الشاشات الداخلية: الشريط السفليّ يُركَّب هنا مرّةً واحدة.
// بهذا يبقى الشريط حيّاً وقابلاً للنقر أثناء انتقال الصفحات (لا يُفكَّك ويُعاد بناؤه
// مع كل تنقّل كما كان)، ويظهر هيكل loading.tsx تحته فوراً.
import type { ReactNode } from "react";
import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
