// utils/formatDate.ts
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) {
    return "N/A"; // Trả về "N/A" nếu ngày không hợp lệ hoặc undefined/null
  }

  // Xử lý nếu là chuỗi và có ký tự 'T' (ví dụ: "2024-11-02T14:09:10.68")
  if (typeof date === 'string') {
    if (date.includes('T')) {
      date = date.split('T')[0]; // Tách phần trước 'T' (lấy phần năm-tháng-ngày)
    }
    date = new Date(date.replace(" ", "T"));
  }

  // Kiểm tra nếu dateObj là một ngày hợp lệ
  if (isNaN((date as Date).getTime())) {
    return "N/A";
  }

  const dateObj = date as Date;
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateTime = (datetime: string | null | undefined): string => {
  if (!datetime) {
    return "N/A"; // Xử lý nếu null hoặc undefined
  }

  const dateObj = new Date(datetime.replace(" ", "T"));

  // Kiểm tra nếu dateObj là một ngày hợp lệ
  if (isNaN(dateObj.getTime())) {
    return "N/A";
  }

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
