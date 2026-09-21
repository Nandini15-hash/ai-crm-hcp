import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInteractions } from "../redux/interactionSlice";

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

// FastAPI's docs UI pre-fills string fields with the literal word "string"
// when someone tests an endpoint without changing the example — filtered
// out here so leftover test data doesn't show up as a real doctor.
const JUNK_VALUES = new Set(["", "string", "na", "n/a", "none"]);

function Dashboard() {
  const dispatch = useDispatch();
  const interactions = useSelector((state) => state.interaction.interactions);
  const status = useSelector((state) => state.interaction.status);

  useEffect(() => {
    // Derive every stat below from the same shared list the rest of the
    // app uses, so the Dashboard updates the moment a new interaction is
    // logged anywhere (form or AI chat) instead of needing its own
    // separate fetch to notice the change.
    if (status === "idle") {
      dispatch(fetchInteractions());
    }
  }, [status, dispatch]);

  const validDoctors = interactions
    .map((item) => item.hcp_name)
    .filter((name) => name && !JUNK_VALUES.has(name.trim().toLowerCase()));

  const uniqueDoctors = [...new Set(validDoctors)];

  const pendingFollowups = interactions.filter((item) => {
    const followUp = (item.follow_up || "").trim().toLowerCase();
    return followUp && !JUNK_VALUES.has(followUp);
  });

  const totalVisits = interactions.length;

  const chartData = [
    { name: "Visits", value: totalVisits },
    { name: "Doctors", value: uniqueDoctors.length },
    { name: "Follow-ups", value: pendingFollowups.length },
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
                {totalVisits}
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
                {pendingFollowups.length}
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
                {totalVisits}
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

            {uniqueDoctors.length === 0 ? (
              <Typography color="text.secondary">No doctors logged yet.</Typography>
            ) : (
              uniqueDoctors.map((doctor, index) => (
                <Typography key={index}>
                  • {doctor}
                </Typography>
              ))
            )}
          </Paper>
        </Grid>

      </Grid>
    </div>
  );
}

export default Dashboard;
