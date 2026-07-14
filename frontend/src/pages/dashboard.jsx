import { useEffect, useState } from "react";
import api from "../services/api";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [summary, setSummary] = useState({
    total_visits: 0,
    doctors_visited: [],
  });

  useEffect(() => {
    api
      .get("/visit-summary")
      .then((res) => {
        setSummary(res.data);
      })
      .catch(console.error);
  }, []);

  const validDoctors = summary.doctors_visited.filter(
    (doctor) =>
      doctor &&
      doctor.trim() !== "" &&
      doctor.toLowerCase() !== "string" &&
      doctor.toLowerCase() !== "na"
  );

  const uniqueDoctors = [...new Set(validDoctors)];

  const chartData = [
    {
      name: "Visits",
      value: summary.total_visits,
    },
    {
      name: "Doctors",
      value: uniqueDoctors.length,
    },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: "#1976d2", color: "white" }}>
            <CardContent>
              <Typography variant="h6">
                Total Visits
              </Typography>

              <Typography variant="h3">
                {summary.total_visits}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: "#2e7d32", color: "white" }}>
            <CardContent>
              <Typography variant="h6">
                Doctors
              </Typography>

              <Typography variant="h3">
                {uniqueDoctors.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: "#ed6c02", color: "white" }}>
            <CardContent>
              <Typography variant="h6">
                Follow-ups
              </Typography>

              <Typography variant="h3">
                {summary.total_visits}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: "#6a1b9a", color: "white" }}>
            <CardContent>
              <Typography variant="h6">
                AI Logged
              </Typography>

              <Typography variant="h3">
                {summary.total_visits}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              CRM Analytics
            </Typography>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">
              Recent Doctors
            </Typography>

            {uniqueDoctors.map((doctor, index) => (
              <Typography key={index}>
                • {doctor}
              </Typography>
            ))}
          </Paper>
        </Grid>

      </Grid>
    </div>
  );
}

export default Dashboard;