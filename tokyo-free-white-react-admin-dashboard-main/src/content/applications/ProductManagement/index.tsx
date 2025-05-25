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
  Button
} from '@mui/material';
import { useEffect, useState, ChangeEvent } from 'react';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const getProducts = async () => {
    try {
      const response = await axios.get<Product[]>('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
  };

  const handleEdit = (productId: string) => {
    console.log('Edit', productId);
    // Navigate to edit page or open dialog
  };

  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      getProducts();
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  const paginatedProducts = products.slice(page * limit, page * limit + limit);

  return (
    <Card>
      <CardHeader
        title="Product Management"
        action={
          <Button variant="contained" startIcon={<AddIcon />} size="small">
            Add Product
          </Button>
        }
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
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
                <TableCell>
                  <Typography fontWeight="bold">{product.name}</Typography>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                <TableCell align="right">{product.stock}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit" arrow>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(product.id)}
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
                <TableCell colSpan={5} align="center">
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
    </Card>
  );
};

export default ProductManagement;
