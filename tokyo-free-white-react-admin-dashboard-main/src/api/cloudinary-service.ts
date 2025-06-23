import axios, { AxiosResponse } from 'axios';
import { CloudinaryUploadResponse } from '../models/CloudinaryUploadResponse';
import { UploadImageOptions } from '../models/UploadImageOptions';

// const CLOUDINARY_URL: string =
//   'cloudinary://178161493966793:VfqWtBGWC21t9ND0isu-fp1JIoE@dt3yrf9sx';

export const uploadImageToCloudinary = async ({
  file,
  uploadPreset,
  folder,
}: UploadImageOptions): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (folder) formData.append('folder', folder);

  try {
    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/dt3yrf9sx/image/upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return res.data;
  } catch (error) {
    console.error('Cloudinary upload error:', error.response?.data || error.message);
    throw error;
  }
};

