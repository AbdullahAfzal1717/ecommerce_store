import React from "react";
import {
  Card,
  CardContent,
  Stack,
  Avatar,
  Box,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

const ProfileHeader = ({ user, onEdit }) => {
  const isAdmin = user?.role === "admin";

  const getStatusColor = (status) => {
    if (status === "green") return "success";
    if (status === "yellow") return "warning";
    return "error";
  };

  return (
    <Card sx={{ borderRadius: 6, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <CardContent>
        <Stack alignItems="center" spacing={2} py={3}>
          <Avatar
            src={user?.avatar}
            sx={{
              width: 140,
              height: 140,
              border: "5px solid",
              borderColor: isAdmin ? "secondary.main" : "primary.main",
              boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            }}
          />
          <Box textAlign="center">
            <Typography variant="h3" fontWeight="800" mb={0.5}>
              {user?.username}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              <Chip
                label={user?.role?.toUpperCase()}
                size="small"
                color={isAdmin ? "secondary" : "default"}
                sx={{ fontWeight: "bold" }}
              />
              <Chip
                label={user?.accountStatus?.toUpperCase()}
                size="small"
                color={getStatusColor(user?.accountStatus)}
                variant="outlined"
                sx={{ fontWeight: "bold" }}
              />
            </Stack>
          </Box>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={onEdit}
            sx={{ borderRadius: 3, px: 4, fontWeight: "bold" }}
          >
            Edit Profile
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
