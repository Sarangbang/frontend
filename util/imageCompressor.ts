import imageCompression from 'browser-image-compression';

/**
 * 이미지 파일을 압축하여 반환
 * @param file 압축할 이미지 파일
 * @param maxSizeMB 최대 이미지 용량 (MB 기준)
 * @returns 압축된 이미지 파일
 */
export const compressImage = async (
  file: File,
  maxSizeMB = 1
): Promise<File> => {
  const options = {
    maxSizeMB,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('이미지 압축 실패:', error);
    throw error;
  }
};
