// 핵심 로직: 종료일 Date 객체 계산
const getCalculatedEndDate = (start: Date, duration: string): Date => {
  const end = new Date(start);
  if (duration.includes('주')) {
    const weeks = parseInt(duration);
    end.setDate(end.getDate() + weeks * 7);
  } else if (duration === '한 달') {
    end.setMonth(end.getMonth() + 1);
  }
  return end;
};

// ✅ YYYY-MM-DD 문자열 반환
export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// string으로 포맷된 날짜 반환
export const calculateEndDate = (start: Date, duration: string): string => {
    const end = getCalculatedEndDate(start, duration);
    return formatDateToYYYYMMDD(end);
};

// Date 객체 반환
export const calculateEndDateObject = getCalculatedEndDate;

// 날짜 포맷 출력
export const formatToDotDate = (date: Date) =>
  date
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, ".")
    .replace(/\.$/, "");
