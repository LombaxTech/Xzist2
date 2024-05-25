export function formatDate(date: any) {
  const now = new Date();

  // Check if the provided date is today
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    // Get the hours and minutes from the date object
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Return the time in HH:MM format
    return `${hours}:${minutes}`;
  } else {
    // Get the day, month, and year from the date object
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero based, so we add 1
    const year = date.getFullYear();

    // Return the date in DD-MM-YYYY format
    return `${day}-${month}-${year}`;
  }
}

// utils/formatDate.ts
export function formatDateAsInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function areDatesEqual(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export function generatePassword(length: number): string {
  const uppercase: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase: string = "abcdefghijklmnopqrstuvwxyz";
  const digits: string = "0123456789";

  const allChars: string = uppercase + lowercase + digits;
  let password: string = "";

  for (let i = 0; i < length; i++) {
    const randomIndex: number = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  return password;
}

export function isToday(date: Date) {
  if (
    new Date().getDate() === new Date(date).getDate() &&
    new Date().getMonth() === new Date(date).getMonth()
  ) {
    return true;
  } else {
    return false;
  }
}

export function isInCurrentWeek(date: Date) {
  const today = new Date();
  const startOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay()
  );
  const endOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + (6 - today.getDay())
  );

  return date >= startOfWeek && date <= endOfWeek;
}

export function isInCurrentMonth(date: Date) {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return date >= startOfMonth && date <= endOfMonth;
}

export function isDateInPast(date: Date) {
  const today = new Date();
  return date < today;
}

export function getKeyForDayMonthYear(): string {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  return `${day}-${month}-${year}`;
}
