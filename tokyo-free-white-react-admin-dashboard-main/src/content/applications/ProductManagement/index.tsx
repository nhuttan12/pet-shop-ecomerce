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
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    category: 'Smartphones',
    price: 1399,
    stock: 25
  },
  {
    id: '2',
    name: 'MacBook Air M2',
    category: 'Laptops',
    price: 1199,
    stock: 12
  },
  {
    id: '3',
    name: 'Samsung Galaxy S24',
    category: 'Smartphones',
    price: 999,
    stock: 30
  },
  {
    id: '4',
    name: 'iPad Pro M2',
    category: 'Tablets',
    price: 1099,
    stock: 18
  },
  {
    id: '5',
    name: 'Sony WH-1000XM5',
    category: 'Headphones',
    price: 399,
    stock: 50
  },
  {
    id: '6',
    name: 'Apple Watch Ultra 2',
    category: 'Wearables',
    price: 799,
    stock: 10
  }
];

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

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
  };

  const paginatedProducts = products.slice(page * limit, page * limit + limit);

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
