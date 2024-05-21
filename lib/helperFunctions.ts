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