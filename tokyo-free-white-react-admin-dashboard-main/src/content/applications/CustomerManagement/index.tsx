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
import { useState } from 'react';
import { Button } from '@mui/material';


interface Customer {
  id: string;
  name: string;
  email: string;
  joined: string;
  status: 'Active' | 'Inactive' | 'Banned';
}

const mockCustomers: Customer[] = [
  {
    id: 'CUS123456',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    joined: '2025-06-01',
    status: 'Active'
  },
  {
    id: 'CUS234567',
    name: 'Bob Smith',
    email: 'bob@example.com',
    joined: '2025-05-28',
    status: 'Inactive'
  },
  {
    id: 'CUS345678',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    joined: '2025-04-20',
    status: 'Banned'
  },
  {
    id: 'CUS456789',
    name: 'Diana Ross',
    email: 'diana@example.com',
    joined: '2025-03-15',
    status: 'Active'
  },
  {
    id: 'CUS567890',
    name: 'Eric Clapton',
    email: 'eric@example.com',
    joined: '2025-02-10',
    status: 'Inactive'
  }
];

const CustomerManagement = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.checked ? mockCustomers.map((c) => c.id) : []);
  };

  const handleSelectOne = (id: string) => {
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

  const paginated = mockCustomers.slice(page * limit, page * limit + limit);

  return (
    <Card>
<CardHeader
  title="Customer Management"
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
      + Add User
    </Button>
  }
/>      <Divider />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selected.length === mockCustomers.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Joined</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
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
              <TableCell>{customer.joined}</TableCell>
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
          count={mockCustomers.length}
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
