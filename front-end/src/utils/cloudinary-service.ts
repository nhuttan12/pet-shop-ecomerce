import axios, { AxiosResponse } from 'axios';
import { CloudinaryUploadResponse } from '../types/CloudinaryUploadResponse';
import { UploadImageOptions } from '../types/UploadImageOptions';

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
  formData.append('folder', folder);

  const res: AxiosResponse<CloudinaryUploadResponse> = await axios.post(
    'https://api.cloudinary.com/v1_1/dt3yrf9sx/image/upload',
    formData
  );

  return res.data;
};
