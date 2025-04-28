// change the file name to formatDate.ts
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isToday) {
    // Show only hour (24-hour format)
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    // Show date (YYYY-MM-DD)
    return `${String(date.getFullYear()).slice(-2)}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  }
};
