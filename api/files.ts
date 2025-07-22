export async function getPresignedUrl(key: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${baseUrl}/api/files/presigned-url?key=${encodeURIComponent(key)}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Presigned URL 요청 실패');
  return await response.text();
}
