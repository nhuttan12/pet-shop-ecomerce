import {
  getProducts,
  createProduct,
  deleteProduct
} from '../../../api/productApi';
import { Product } from '../../../models/Product';

import {
  Card,
  CardHeader,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  IconButton,
  Typography,
  Tooltip,
  Box,
  Divider,
  Button,
  Checkbox
} from '@mui/material';
import { useState, ChangeEvent, useEffect } from 'react';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddIcon from '@mui/icons-material/Add';
import AddProductDialog from './AddProductDialog';
import { uploadImageToCloudinary } from '../../../api/cloudinary-service';

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );

  const [openDialog, setOpenDialog] = useState(false);
  const initialNewProduct: Omit<Product, 'id'> = {
    name: '',
    brandName: '',
    categoryName: '',
    description: '',
    discount: 0,
    price: 0,
    quantity: 0,
    mainImage: '',
    subImages: []
  };

  const [newProduct, setNewProduct] =
    useState<Omit<Product, 'id'>>(initialNewProduct);

  // Lấy danh sách sản phẩm
  useEffect(() => {
    getProducts(page + 1, limit)
      .then((res) => {
        if (res.data?.data) {
          setProducts(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Không lấy được sản phẩm:', err);
      });
  }, [page, limit]);

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
    setPage(0);
  };

  const handleDelete = (productId: string) => {
    deleteProduct(productId)
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        setSelectedProducts((prev) => {
          const copy = new Set(prev);
          copy.delete(productId);
          return copy;
        });
      })
      .catch((err) => {
        console.error('Xoá sản phẩm thất bại:', err);
      });
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = paginatedProducts.map((p) => p.id);
      setSelectedProducts(new Set(allIds));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedProducts((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }
      return copy;
    });
  };

  const handleOpenDialog = () => {
    setNewProduct(initialNewProduct); // Reset form
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' || name === 'discount' ? Number(value) : value
    }));
  };

  // Upload ảnh chính lên Cloudinary, cập nhật URL vào newProduct.mainImage
  const handleUploadMainImage = async (file: File) => {
    const uploadPreset = 'your_upload_preset'; // Thay bằng preset của bạn
    const folder = 'your_folder_name'; // Thay bằng folder bạn muốn lưu

    try {
      const res = await uploadImageToCloudinary({ file, uploadPreset, folder });
      setNewProduct((prev) => ({
        ...prev,
        mainImage: res.secure_url
      }));
    } catch (error) {
      console.error('Upload ảnh chính thất bại:', error);
    }
  };

  const handleAddProduct = () => {
    // Dùng đúng giá trị đang có
    const payload = {
      ...newProduct,
      brandName: newProduct.brandName || 'Generic Brand',
      discount: newProduct.discount || 0
    };

    createProduct(payload)
      .then((res) => {
        setProducts((prev) => [...prev, res.data.data]);
        handleCloseDialog();
      })
      .catch((err) => {
        console.error('Thêm sản phẩm thất bại:', err);
      });
  };

  const paginatedProducts = products.slice(page * limit, page * limit + limit);
  const isAllSelected = paginatedProducts.every((p) =>
    selectedProducts.has(p.id)
  );
  const isSomeSelected = paginatedProducts.some((p) =>
    selectedProducts.has(p.id)
  );

  return (
    <Card>
      <CardHeader
        title="Quản lý sản phẩm"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ background: '#6366f1', '&:hover': { background: '#4f46e5' } }}
            onClick={handleOpenDialog}
          >
            Thêm sản phẩm mới
          </Button>
        }
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isAllSelected && paginatedProducts.length > 0}
                  indeterminate={!isAllSelected && isSomeSelected}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Phân loại</TableCell>
              <TableCell align="right">Giá</TableCell>
              <TableCell align="right">Tồn kho</TableCell>
              <TableCell align="right">Tuỳ chỉnh</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow hover key={product.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProducts.has(product.id)}
                    onChange={() => handleSelectOne(product.id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">{product.name}</Typography>
                </TableCell>
                <TableCell>{product.categoryName}</TableCell>
                <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                <TableCell align="right">{product.quantity}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit" arrow>
                    <IconButton
                      color="primary"
                      onClick={() => console.log('Edit', product.id)}
                    >
                      <EditTwoToneIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(product.id)}
                    >
                      <DeleteTwoToneIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {paginatedProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có sản phẩm nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={products.length}
          page={page}
          rowsPerPage={limit}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

      <AddProductDialog
        open={openDialog}
        newProduct={newProduct}
        onClose={handleCloseDialog}
        onChange={handleInputChange}
        onAdd={handleAddProduct}
        onSubImagesChange={(val) => {
          try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              setNewProduct((prev) => ({
                ...prev,
                subImages: parsed
              }));
            }
          } catch (err) {
            console.error('Lỗi định dạng subImages:', err);
          }
        }}
        onUploadMainImage={handleUploadMainImage}
      />
    </Card>
  );
};

export default ProductManagement;
