import { DateRange } from "react-day-picker";

// 핵심 로직: 종료일 Date 객체 계산
const getCalculatedEndDate = (start: Date, duration: string): Date => {
  const end = new Date(start);
  if (duration.includes("주")) {
    const weeks = parseInt(duration);
    end.setDate(end.getDate() + weeks * 7);
  } else if (duration === "한 달") {
    end.setMonth(end.getMonth() + 1);
  }
  return end;
};

// ✅ YYYY-MM-DD 문자열 반환
export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 0부터 시작
  const day = String(date.getDate()).padStart(2, "0");
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
export function formatRange(startDate: Date, endDate: Date): string {
  const format = (date: Date) =>
    date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, ".")
      .replace(/\.$/, "");
  return `${format(startDate)} ~ ${format(endDate)}`;
}

export const calculatePeriod = (startDateStr: string, endDateStr: string): string => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const diffInMs = endDate.getTime() - startDate.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays < 0) return "종료";

  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();
  const totalMonths = years * 12 + months;

  if (totalMonths > 0) {
    return `${totalMonths}개월`;
  }

  const weeks = Math.floor(diffInDays / 7);
  if (weeks > 0) {
    return `${weeks}주`;
  }

  return `${Math.ceil(diffInDays)}일`;
};

export const getChallengeStatus = (
  startDateStr: string,
  endDateStr: string,
): "예정" | "진행중" | "종료" => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(startDateStr);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(endDateStr);
  endDate.setHours(0, 0, 0, 0);

  if (today < startDate) {
    return "예정";
  }
  if (today > endDate) {
    return "종료";
  }
  return "진행중";
};
