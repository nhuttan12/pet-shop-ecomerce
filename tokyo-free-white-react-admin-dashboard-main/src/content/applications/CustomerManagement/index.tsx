import {
  Card,
  CardHeader,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Typography,
  IconButton,
  Box,
  Tooltip,
  TablePagination,
  Chip
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { getAllUsers } from 'src/api/user';
import { Customer } from 'src/models/Customer.interface';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setCustomers(data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };

    fetchUsers();
  }, []);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.checked ? customers.map((c) => c.id) : []);
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'warning';
      case 'Banned':
        return 'error';
      default:
        return 'default';
    }
  };

  const paginated = customers.slice(page * limit, page * limit + limit);

  return (
    <Card>
      <CardHeader
        title="Quản lý khách hàng"
        action={
          <Button
            variant="contained"
            sx={{
              background: '#6366f1',
              '&:hover': {
                background: '#4f46e5'
              }
            }}
          >
            + Thêm khách hàng
          </Button>
        }
      />{' '}
      <Divider />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selected.length === customers.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>Tên</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell align="right">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((customer) => (
            <TableRow key={customer.id} hover>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selected.includes(customer.id)}
                  onChange={() => handleSelectOne(customer.id)}
                />
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">{customer.name}</Typography>
              </TableCell>
              <TableCell>{customer.id}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.created_at}</TableCell>
              <TableCell>
                <Chip
                  label={customer.status}
                  color={getStatusColor(customer.status)}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton color="primary">
                    <EditTwoToneIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="error">
                    <DeleteTwoToneIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box p={2}>
        <TablePagination
          component="div"
          count={customers.length}
          page={page}
          rowsPerPage={limit}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setLimit(parseInt(e.target.value))}
          rowsPerPageOptions={[5, 10]}
        />
      </Box>
    </Card>
  );
};

export default CustomerManagement;
