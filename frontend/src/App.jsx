import { useState } from "react";
import { Box, Toolbar } from "@mui/material";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

import LogForm from "./components/LogForm";
import ChatAssistant from "./components/ChatAssistant";

function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;

      case "log":
        return (
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <LogForm />
            <ChatAssistant />
          </Box>
        );

      case "history":
        return <History />;

      case "settings":
        return (
          <Box>
            <h2>Settings</h2>
            <p>Settings page coming soon...</p>
          </Box>
        );

      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Navbar />

      <Box sx={{ display: "flex" }}>
        <Sidebar setPage={setPage} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#f5f7fb",
            minHeight: "100vh",
            p: 3,
          }}
        >
          <Toolbar />

          {renderPage()}
        </Box>
      </Box>
    </>
  );
}

export default App;