export function formatDate(date: Date, format = "DD/MM/YYYY"): string {
  return new Intl.DateTimeFormat("vi-VN").format(date);
}

export function getDaysBetween(startDate: Date, endDate: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay));
}
