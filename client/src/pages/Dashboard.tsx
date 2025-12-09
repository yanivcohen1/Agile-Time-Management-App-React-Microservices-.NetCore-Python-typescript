import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import api from '../api/axios';
import { BarChart } from '@mui/x-charts/BarChart';

interface WorkloadStat {
  _id: string;
  count: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<WorkloadStat[]>([]);

  useEffect(() => {
    api.get('/todos/stats/workload')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Main Status Board</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Dates by Workload</Typography>
        {stats.length > 0 ? (
           <BarChart
            xAxis={[{ scaleType: 'band', data: stats.map(s => s._id) }]}
            series={[{ data: stats.map(s => s.count) }]}
            width={500}
            height={300}
          />
        ) : (
          <Typography>No data available</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
