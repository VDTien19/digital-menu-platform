import QRCode from 'qrcode';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const generateQRCode = async (qrCodeText) => {
  const tempFilePath = `temp-qr-${Date.now()}.png`;
  await QRCode.toFile(tempFilePath, qrCodeText, {
    width: 200,
    margin: 1,
  });

  try {
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: 'table-qr-codes',
      public_id: `table-qr-${Date.now()}`,
      fetch_format: 'auto',
      quality: 'auto',
    });

    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    return result.secure_url;
  } catch (error) {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    throw new Error(`Failed to upload QR code to Cloudinary: ${error.message}`);
  }
};

export default generateQRCode;
