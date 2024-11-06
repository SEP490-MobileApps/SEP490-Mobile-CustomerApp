// utils/formatDate.ts
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date.replace(" ", "T")) : date;

  // Kiểm tra nếu dateObj là một ngày hợp lệ
  if (isNaN(dateObj.getTime())) {
    return "N/A"; // Hoặc bất kỳ giá trị nào bạn muốn hiển thị khi ngày không hợp lệ
  }

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

// formatDateTime chỉ cần khi cần hiển thị thời gian, nếu không cần thì có thể xóa
export const formatDateTime = (datetime: string): string => {
  const dateObj = new Date(datetime.replace(" ", "T"));

  // Kiểm tra nếu dateObj là một ngày hợp lệ
  if (isNaN(dateObj.getTime())) {
    return "N/A"; // Hoặc bất kỳ giá trị nào bạn muốn hiển thị khi ngày không hợp lệ
  }

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
