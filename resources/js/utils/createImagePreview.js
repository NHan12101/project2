export function createImagePreview(
    file,
    { maxWidth = 1280, quality = 0.7 } = {}
) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const scale = Math.min(1, maxWidth / img.width);

            const canvas = document.createElement('canvas');
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(url);
                    if (!blob) return reject();

                    resolve(URL.createObjectURL(blob));
                },
                'image/webp',
                quality
            );
        };

        img.onerror = reject;
        img.src = url;
    });
}
