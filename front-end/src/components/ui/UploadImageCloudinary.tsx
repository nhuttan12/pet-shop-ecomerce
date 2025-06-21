import { useState , ChangeEvent } from 'react';
import axios, { type AxiosResponse } from 'axios';

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  folder?: string;
}


const UploadImageCloudinary: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [log, setLog] = useState<string[]>([]);

  // const CLOUDINARY_URL: string =
  //   'cloudinary://178161493966793:VfqWtBGWC21t9ND0isu-fp1JIoE@dt3yrf9sx';

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUrl('');
      setLog([]);
    }
  };

  const logMessage = (msg: string) => {
    setLog(prev => [...prev, msg]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Bạn chưa chọn file!');
      return;
    }

    setUploading(true);
    setError('');
    setUrl('');
    setLog([]);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'tmdt-ck');
    formData.append('folder', 'tmldt-ck');

    try {
      logMessage('⏫ Đang upload ảnh lên Cloudinary...');
      const res: AxiosResponse<CloudinaryUploadResponse> = await axios.post(
        'https://api.cloudinary.com/v1_1/dt3yrf9sx/image/upload',
        formData
      );

      const imageData = res.data;
      setUrl(imageData.secure_url);
      logMessage('✅ Upload Cloudinary thành công');
      logMessage(`🖼 URL: ${imageData.secure_url}`);
      logMessage(`📁 Folder: ${imageData.folder || 'Không có (mặc định)'}`);
      logMessage(`🆔 Public ID: ${imageData.public_id}`);

      logMessage('📡 Gửi metadata ảnh về backend...');
      await axios.post('/api/images', {
        url: imageData.secure_url,
        publicId: imageData.public_id,
        folder: 'home/tmldt-ck',
        format: imageData.format,
        size: imageData.bytes,
        width: imageData.width,
        height: imageData.height,
      });

      logMessage('✅ Backend xác nhận lưu ảnh xong');
    } catch (err) {
      setError('Upload thất bại hoặc gọi backend lỗi!');
      console.error(err);
      logMessage('❌ Upload hoặc gọi backend thất bại');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: '20px auto',
        padding: 20,
        border: '1px solid #ddd',
        borderRadius: 8,
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fafafa',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#333' }}>Upload ảnh lên Cloudinary</h2>

      <input
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        style={{ display: 'block', marginBottom: 12 }}
        disabled={uploading}
      />

      {file && (
        <p>
          <strong>File đã chọn:</strong> {file.name} (
          {(file.size / 1024).toFixed(1)} KB)
        </p>
      )}

      {error && (
        <p style={{ color: 'red', marginBottom: 12 }}>
          <strong>Lỗi:</strong> {error}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          width: '100%',
          padding: 10,
          backgroundColor: uploading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: uploading ? 'not-allowed' : 'pointer',
          fontSize: 16,
          marginBottom: 12,
        }}
      >
        {uploading ? 'Đang upload...' : 'Upload'}
      </button>

      {url && (
        <div style={{ textAlign: 'center' }}>
          <p>Upload thành công! Ảnh preview:</p>
          <img
            src={url}
            alt='Uploaded'
            style={{
              maxWidth: '100%',
              borderRadius: 8,
              border: '1px solid #ccc',
              boxShadow: '0 0 8px rgba(0,0,0,0.1)',
            }}
          />
          <p>
            <a href={url} target='_blank' rel='noopener noreferrer'>
              Mở ảnh trong tab mới
            </a>
          </p>
        </div>
      )}

      {log.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <strong>📋 Debug log:</strong>
          <ul style={{ fontSize: 14, paddingLeft: 20 }}>
            {log.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadImageCloudinary;