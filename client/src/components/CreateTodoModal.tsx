import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, 
  FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../api/axios';
import { useSnackbar } from 'notistack';

interface CreateTodoModalProps {
  open: boolean;
  onClose: () => void;
  onTodoCreated?: () => void;
}

const CreateTodoModal: React.FC<CreateTodoModalProps> = ({ open, onClose, onTodoCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('BACKLOG');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    try {
      await api.post('/todos/', {
        title,
        description,
        status,
        due_date: dueDate ? dueDate.toISOString() : null
      });
      enqueueSnackbar('Todo created successfully', { variant: 'success' });
      if (onTodoCreated) onTodoCreated();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStatus('BACKLOG');
    setDueDate(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Todo</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          name="title"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Description"
          name="description"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="BACKLOG">Backlog</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTodoModal;
