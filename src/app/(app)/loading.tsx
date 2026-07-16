// عون — الهيكل الفوريّ: يظهر لحظة النقر ريثما تصل بيانات الصفحة من الخادم.
// وجودُه شرطٌ في Next لتهيئة الصفحات الديناميكية مسبقاً (prefetch)؛ فبدونه كان
// النقر يبقى بلا أثرٍ حتى يفرغ الخادم من الاستعلام — وهو سببُ الإحساس بالبطء.
export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-lg px-5 pb-32 pt-3" aria-busy>
      <span className="sr-only">جارٍ التحميل…</span>

      <div aria-hidden className="animate-pulse">
        {/* الشريط العلويّ */}
        <div className="flex h-10 items-center">
          <span className="h-7 w-24 rounded-full bg-[--color-surface-2]" />
        </div>

        {/* الترويسة */}
        <div className="mt-3 flex items-end justify-between gap-3">
          <span className="h-8 w-48 rounded-[10px] bg-[--color-surface-2]" />
          <span className="mb-1 h-3.5 w-16 rounded-full bg-[--color-surface-2]" />
        </div>

        {/* اللوحة البطلة */}
        <div className="mt-4 h-44 rounded-[--radius-xl] bg-[--color-surface-2]" />

        {/* سطرٌ هادئ */}
        <div className="mt-4 flex justify-center">
          <span className="h-3.5 w-56 rounded-full bg-[--color-surface-2]" />
        </div>

        {/* صفوف البطاقات */}
        <div className="mt-6 flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-[--radius-card] bg-[--color-surface-2] px-3 py-3"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <span className="h-10 w-10 shrink-0 rounded-full bg-[--color-surface-3]" />
              <span className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="h-3.5 w-2/5 rounded-full bg-[--color-surface-3]" />
                <span className="h-2.5 w-1/4 rounded-full bg-[--color-surface-3]" />
              </span>
              <span className="h-7 w-7 shrink-0 rounded-full bg-[--color-surface-3]" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
