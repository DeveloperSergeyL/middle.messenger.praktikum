export default function formatChatTime(dateStr: string): string {
  if (!dateStr) return "";

  const parts = dateStr.split(".").map(Number);;
  if (parts.length !== 3 || parts.some(isNaN)) return dateStr;

  const tooDay = "20.06.2020";
  const partsTooDay = tooDay.split(".").map(Number);

  const msgDate = new Date(parts[2], parts[1] - 1, parts[0]);
  const nowDate = new Date(
    partsTooDay[2],
    partsTooDay[1] - 1,
    partsTooDay[0]
  );

  const msgDateZero = new Date(
    msgDate.getFullYear(),
    msgDate.getMonth(),
    msgDate.getDate(),
  );
  const nowDateZero = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate(),
  );

  const diffTime = nowDateZero.getTime() - msgDateZero.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "today";
  }

  if (diffDays > 0 && diffDays < 7) {
    const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    return daysOfWeek[msgDate.getDay()];
  }

  const day = String(msgDate.getDate()).padStart(2, "0");
  const month = String(msgDate.getMonth() + 1).padStart(2, "0");
  const year = String(msgDate.getFullYear()).slice();

  return `${day}.${month}.${year}`;
}
