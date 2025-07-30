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
    fileType: 'image/jpeg', // JPEG로 통일하여 호환성 향상
  };

  try {
    console.log('압축 전 파일 정보:', {
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
      type: file.type
    });

    const compressedFile = await imageCompression(file, options);
    
    console.log('압축 후 파일 정보:', {
      name: compressedFile.name,
      size: (compressedFile.size / 1024 / 1024).toFixed(2) + 'MB',
      type: compressedFile.type
    });

    // 파일명에 타임스탬프 추가하여 고유성 보장
    const timestamp = Date.now();
    const extension = compressedFile.name.split('.').pop() || 'jpg';
    const newFileName = `challenge_${timestamp}.${extension}`;
    
    // 새로운 File 객체 생성 (파일명 변경)
    const renamedFile = new File([compressedFile], newFileName, {
      type: compressedFile.type,
      lastModified: Date.now(),
    });

    return renamedFile;
  } catch (error) {
    console.error('이미지 압축 실패:', error);
    throw error;
  }
};
