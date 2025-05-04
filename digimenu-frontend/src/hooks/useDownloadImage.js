import { useCallback } from "react";
import DomToImage from "dom-to-image";

const useDownloadImage = () => {
    const downloadImage = useCallback((ref, filename='qr.png') => {
        if(!ref.current) return;
        DomToImage.toPng(ref.current, { quanlity: 0.95 })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = filename;
                link.href = dataUrl;
                link.click();
            })
            .catch (error => {
                console.error('Error downloading image:', error);
            })
    }, []);

    return { downloadImage };
}

export default useDownloadImage;