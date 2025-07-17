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

export const calculatePeriod2 = (startDateStr: string, endDateStr: string): string => {
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

// 두 날짜 사이의 기간을 계산하는 함수 (일 단위)
export function calculatePeriod(startDate: string, endDate: string): number {
  // 문자열을 Date 객체로 변환
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // 밀리초 차이를 계산하고 일 단위로 변환
  const timeDifference = end.getTime() - start.getTime();
  const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  
  return dayDifference;
}

// 기간을 한국어로 포맷하는 함수
export function formatPeriod(days: number): string {
  if (days < 7) {
    return `${days}일`;
  } else if (days < 30) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    if (remainingDays === 0) {
      return `${weeks}주`;
    } else {
      return `${weeks}주 ${remainingDays}일`;
    }
  } else {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    if (remainingDays === 0) {
      return `${months}개월`;
    } else {
      return `${months}개월 ${remainingDays}일`;
    }
  }
}
