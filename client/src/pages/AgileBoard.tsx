import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { Box, Typography, Paper, Card, CardContent } from '@mui/material';
import api from '../api/axios';

interface Todo {
  _id: string;
  title: string;
  status: string;
}

const AgileBoard: React.FC = () => {
  const [columns, setColumns] = useState<{ [key: string]: Todo[] }>({
    BACKLOG: [],
    PENDING: [],
    IN_PROGRESS: [],
    COMPLETED: []
  });

  const fetchTodos = useCallback(async () => {
    try {
      const res = await api.get('/todos/', { params: { size: 100 } }); // Fetch all for board
      const todos: Todo[] = res.data.items;
      const newColumns: { [key: string]: Todo[] } = {
        BACKLOG: [],
        PENDING: [],
        IN_PROGRESS: [],
        COMPLETED: []
      };
      todos.forEach(todo => {
        if (newColumns[todo.status]) {
          newColumns[todo.status].push(todo);
        }
      });
      setColumns(newColumns);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodos();
  }, [fetchTodos]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = [...columns[source.droppableId]];
      const destColumn = [...columns[destination.droppableId]];
      const [removed] = sourceColumn.splice(source.index, 1);
      destColumn.splice(destination.index, 0, { ...removed, status: destination.droppableId });
      
      setColumns({
        ...columns,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn
      });

      try {
        await api.put(`/todos/${removed._id}`, { status: destination.droppableId });
      } catch (error) {
        console.error("Failed to update status", error);
        fetchTodos(); // Revert on error
      }
    } else {
      const column = [...columns[source.droppableId]];
      const [removed] = column.splice(source.index, 1);
      column.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: column
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Agile Board</Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {Object.entries(columns).map(([columnId, tasks]) => (
            <Box key={columnId} sx={{ minWidth: 280, width: 300 }}>
              <Paper sx={{ p: 2, bgcolor: '#f4f5f7', minHeight: 500 }}>
                <Typography variant="h6" gutterBottom>{columnId.replace('_', ' ')}</Typography>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{ minHeight: 400 }}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ mb: 2 }}
                            >
                              <CardContent>
                                <Typography variant="body1">{task.title}</Typography>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Paper>
            </Box>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default AgileBoard;
