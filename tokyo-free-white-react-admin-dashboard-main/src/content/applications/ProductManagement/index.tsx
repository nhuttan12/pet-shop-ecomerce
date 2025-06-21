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
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { useState, ChangeEvent } from 'react';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddIcon from '@mui/icons-material/Add';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const initialProducts: Product[] = [
  { id: '1', name: 'iPhone 15 Pro Max', category: 'Smartphones', price: 1399, stock: 25 },
  { id: '2', name: 'MacBook Air M2', category: 'Laptops', price: 1199, stock: 12 },
  { id: '3', name: 'Samsung Galaxy S24', category: 'Smartphones', price: 999, stock: 30 },
  { id: '4', name: 'iPad Pro M2', category: 'Tablets', price: 1099, stock: 18 },
  { id: '5', name: 'Sony WH-1000XM5', category: 'Headphones', price: 399, stock: 50 },
  { id: '6', name: 'Apple Watch Ultra 2', category: 'Wearables', price: 799, stock: 10 }
];

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const [openDialog, setOpenDialog] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    category: '',
    price: 0,
    stock: 0
  });

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
  };

  const handleEdit = (productId: string) => {
    console.log('Edit', productId);
  };

  const handleDelete = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    setSelectedProducts((prev) => {
      const copy = new Set(prev);
      copy.delete(productId);
      return copy;
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
    setNewProduct({ id: '', name: '', category: '', price: 0, stock: 0 });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleAddProduct = () => {
    const id = (Math.random() * 1000000).toFixed(0); // generate random id
    const productToAdd = { ...newProduct, id };
    setProducts((prev) => [...prev, productToAdd]);
    handleCloseDialog();
  };

  const paginatedProducts = products.slice(page * limit, page * limit + limit);
  const isAllSelected = paginatedProducts.every((p) => selectedProducts.has(p.id));
  const isSomeSelected = paginatedProducts.some((p) => selectedProducts.has(p.id));

  return (
    <Card>
      <CardHeader
        title="Product Management"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: '#6366f1',
              '&:hover': {
                background: '#4f46e5'
              }
            }}
            onClick={handleOpenDialog}
          >
            Add Product
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
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right">Actions</TableCell>
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
                <TableCell>{product.category}</TableCell>
                <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                <TableCell align="right">{product.stock}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit" arrow>
                    <IconButton color="primary" onClick={() => handleEdit(product.id)}>
                      <EditTwoToneIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <IconButton color="error" onClick={() => handleDelete(product.id)}>
                      <DeleteTwoToneIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {paginatedProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No products found.
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

      {/* Dialog thêm sản phẩm */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Product Name"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Category"
            name="category"
            value={newProduct.category}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={newProduct.stock}
            onChange={handleInputChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddProduct}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ProductManagement;
