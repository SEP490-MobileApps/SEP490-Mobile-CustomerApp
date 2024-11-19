// utils/formatDate.ts

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) {
    return "N/A"; // Trả về "N/A" nếu ngày không hợp lệ hoặc undefined/null
  }

  if (typeof date === "string") {
    if (date.includes("T")) {
      date = date.split("T")[0];
    }
    date = new Date(date.replace(" ", "T"));
  }

  if (isNaN((date as Date).getTime())) {
    return "N/A";
  }

  const dateObj = date as Date;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatDateToAPI = (date: string): string | null => {
  const parts = date.split("-");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`; // Trả về định dạng yyyy-mm-dd
};

export const formatDateTime = (datetime: string | null | undefined): string => {
  if (!datetime) {
    return "N/A";
  }

  const dateObj = new Date(datetime.replace(" ", "T"));
  if (isNaN(dateObj.getTime())) {
    return "N/A";
  }

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};
