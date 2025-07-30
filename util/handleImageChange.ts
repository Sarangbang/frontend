import toast from "react-hot-toast";
import { compressImage } from "@/util/imageCompressor";

/**
 *  이미지 파일을 받아 압축하고 미리보기 URL과 함께 반환
 */

export const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    maxSizeMB = 5,
    quality = 1
): Promise<{ preview: string; file: File } | null> => {
    const file = event.target.files?.[0];
    if (!file) return null;
    
    // (1) 타입 검사 추가
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        toast.error('JPG 또는 PNG 이미지 파일만 업로드할 수 있습니다.');
        return null;
    }

    // (2) 용량 검사
    if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${maxSizeMB}MB 이하 이미지만 업로드할 수 있습니다.`);
        return null;
    }

    // (3) 압축 실행
    try {
        const compressed = await compressImage(file, quality);
        console.log('압축 전 파일 크기:', (file.size / 1024 / 1024).toFixed(2), 'MB');
        console.log('압축 후 파일 크기:', (compressed.size / 1024 / 1024).toFixed(2), 'MB');
        
        // (4) 압축된 파일 유효성 검사
        if (!compressed || !(compressed instanceof File)) {
            throw new Error('압축된 파일이 유효하지 않습니다.');
        }
        
        // (5) 미리보기용 Blob URL 생성
        const preview = URL.createObjectURL(compressed);
        console.log('handleImageChange에서 생성된 미리보기 URL:', preview);

        return { preview, file: compressed };
    } catch (error) {
        console.error("이미지 압축 실패:", error);
        toast.error(`${maxSizeMB}MB 이하의 JPG/PNG 파일을 다시 선택해주세요.`);
        return null;
    }
}