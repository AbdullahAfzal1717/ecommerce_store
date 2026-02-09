import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { AdminPanelSettings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AdminConsoleCard = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          p: 3,
          mt: 2,
          borderRadius: 4,
          bgcolor: "secondary.main",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AdminPanelSettings
          sx={{
            position: "absolute",
            right: -10,
            bottom: -10,
            fontSize: 80,
            opacity: 0.1,
          }}
        />
        <Typography variant="h5" fontWeight="800" mb={1}>
          Admin Console
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
          You have full access to manage users, update orders, and monitor
          system analytics.
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: "white",
            color: "secondary.main",
            fontWeight: "900",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          Launch User Manager
        </Button>
      </Box>
    </>
  );
};

export default AdminConsoleCard;
