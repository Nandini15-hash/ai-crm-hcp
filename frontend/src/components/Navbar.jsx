import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
} from "@mui/material";

function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        background: "#1565C0",
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
          }}
        >
          AI-First CRM (HCP)
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography>
            Welcome, Sales Rep
          </Typography>

          <Avatar
            sx={{
              bgcolor: "#fff",
              color: "#1565C0",
              fontWeight: "bold",
            }}
          >
            SR
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;