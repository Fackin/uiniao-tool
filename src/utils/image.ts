export const compressImage = (imageSrc: any, maxWidth: number, maxHeight: number, quality: number, success: (blob: Blob | null) => void) => {
    let thumbnailUrl = ''
    const img = new Image();
    img.onload = () => {
        // 计算缩略图尺寸（保持比例）
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
        }
        if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }

        // 使用 Canvas 压缩
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // 转换为 Blob（可设置格式和质量）
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    thumbnailUrl = URL.createObjectURL(blob);
                    success(blob);
                    console.log('压缩后大小:', (blob.size / 1024).toFixed(2), 'KB');
                }
            },
            'image/jpeg', // 可选 'image/png' 或 'image/webp'
            quality
        );
    };
    img.src = imageSrc;

    return thumbnailUrl;
};