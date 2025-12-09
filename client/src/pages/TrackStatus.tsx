import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, TextField, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../api/axios';
import { format } from 'date-fns';

interface Todo {
  id: string;
  title: string;
  status: string;
  due_date: string;
}

const TrackStatus: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);

  const fetchTodos = useCallback(async () => {
    const params: Record<string, unknown> = {
      page: page + 1,
      size: rowsPerPage,
      search: search,
      status: statusFilter || undefined,
    };
    if (dateFilter) {
        // Simple exact date match logic or range logic can be implemented. 
        // For now, let's assume we filter by start date >= selected date
        params.due_date_start = dateFilter.toISOString();
    }

    try {
      const res = await api.get('/todos/', { params });
      setTodos(res.data.items);
      setTotal(res.data.total);
    } catch (error) {
      console.error(error);
    }
  }, [page, rowsPerPage, search, statusFilter, dateFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodos();
  }, [fetchTodos]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Track Status</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField 
          label="Search by Name" 
          variant="outlined" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="BACKLOG">Backlog</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Filter by Date"
            value={dateFilter}
            onChange={(newValue) => setDateFilter(newValue)}
          />
        </LocalizationProvider>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell>{todo.title}</TableCell>
                <TableCell>{todo.status}</TableCell>
                <TableCell>{todo.due_date ? format(new Date(todo.due_date), 'yyyy-MM-dd') : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Box>
  );
};

export default TrackStatus;
