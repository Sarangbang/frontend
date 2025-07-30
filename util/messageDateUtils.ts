export const formatMessageDate = (dateString: string) => {
  const messageDate = new Date(dateString);
  const today = new Date();

  const isToday =
    messageDate.getFullYear() === today.getFullYear() &&
    messageDate.getMonth() === today.getMonth() &&
    messageDate.getDate() === today.getDate();

  if (isToday) {
    // 오늘 보낸 메시지는 시간만 표시 (HH:mm)
    return messageDate.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } else {
    // 이전 날짜는 날짜만 표시 (YYYY. MM. DD.)
    return messageDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\.$/, '');
  }
};
