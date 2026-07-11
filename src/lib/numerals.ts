// عون — تحويل الأرقام إلى الأرقام العربية (٠-٩) لإحساسٍ عربيٍّ أصيل.
const AR = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** يحوّل أي رقم/نص إلى الأرقام العربية. */
export function ar(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => AR[Number(d)]);
}
