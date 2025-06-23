import React, { ChangeEvent, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { Product } from '../../../models/Product';

interface AddProductDialogProps {
  open: boolean;
  newProduct: Omit<Product, 'id'>;
  onClose: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  onSubImagesChange: (value: string) => void;
  onUploadMainImage: (file: File) => Promise<void>;
}

const AddProductDialog = ({
  open,
  newProduct,
  onClose,
  onChange,
  onAdd,
  onSubImagesChange,
  onUploadMainImage,
}: AddProductDialogProps) => {
  const [uploadingMainImage, setUploadingMainImage] = useState(false);

  const handleMainImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingMainImage(true);
      const file = e.target.files[0];
      try {
        await onUploadMainImage(file);
      } catch (error) {
        console.error('Upload ảnh chính lỗi:', error);
      } finally {
        setUploadingMainImage(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm sản phẩm mới</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField label="Tên sản phẩm" name="name" value={newProduct.name} onChange={onChange} required />
        <TextField label="Phân loại" name="categoryName" value={newProduct.categoryName} onChange={onChange} required />
        <TextField label="Thương hiệu" name="brandName" value={newProduct.brandName} onChange={onChange} />
        <TextField label="Mô tả" name="description" multiline minRows={3} value={newProduct.description} onChange={onChange} />
        <TextField label="Giảm giá (%)" name="discount" type="number" value={newProduct.discount} onChange={onChange} />
        <TextField label="Giá" name="price" type="number" value={newProduct.price} onChange={onChange} required />
        <TextField label="Tồn kho" name="quantity" type="number" value={newProduct.quantity} onChange={onChange} required />

        <TextField label="Ảnh chính (URL)" name="mainImage" value={newProduct.mainImage} onChange={onChange} />

        <input
          type="file"
          accept="image/*"
          onChange={handleMainImageFileChange}
          disabled={uploadingMainImage}
          style={{ marginTop: 8 }}
        />
        {uploadingMainImage && <div>Đang upload ảnh chính...</div>}

        <TextField
          label="Ảnh phụ (JSON array)"
          name="subImages"
          value={JSON.stringify(newProduct.subImages)}
          onChange={(e) => onSubImagesChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button variant="contained" onClick={onAdd}>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;
