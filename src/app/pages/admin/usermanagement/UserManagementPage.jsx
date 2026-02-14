import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";
import { Close, AccountTree, Person } from "@mui/icons-material";
import Tree from "react-d3-tree";
import api from "@app/_services/api";

// Transition for the Modal
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [openTree, setOpenTree] = useState(false);
  const [selectedTreeData, setSelectedTreeData] = useState(null);

  useEffect(() => {
    // Fetch all users for the admin list
    api.get("/auth/all-users").then((res) => setUsers(res.data.data));
  }, []);

  const handleViewTree = async (userId) => {
    console.log(userId);
    try {
      const response = await api.get(`/auth/tree/${userId}`);
      console.log("response", response);
      setSelectedTreeData(response.data.data);
      setOpenTree(true);
    } catch (error) {
      console.error("Failed to load tree");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" fontWeight="900" mb={4}>
        User Management
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8f9fa" }}>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Wallet</TableCell>
              <TableCell>Spins</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={user.avatar} sx={{ bgcolor: "primary.main" }}>
                      {user.username[0]}
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold">{user.username}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.accountStatus.toUpperCase()}
                    color={
                      user.accountStatus === "green"
                        ? "success"
                        : user.accountStatus === "yellow"
                          ? "warning"
                          : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>Rs. {user.walletBalance}</TableCell>
                <TableCell>{user.availableSpins}</TableCell>
                <TableCell align="right">
                  <Button
                    startIcon={<AccountTree />}
                    variant="outlined"
                    onClick={() => handleViewTree(user.id)}
                  >
                    View Tree
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* FULL SCREEN TREE MODAL */}
      <Dialog
        fullScreen
        open={openTree}
        onClose={() => setOpenTree(false)}
        TransitionComponent={Transition}
      >
        <AppBar
          sx={{
            position: "relative",
            bgcolor: "#fff",
            color: "#000",
            boxShadow: "none",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpenTree(false)}
            >
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              Network Analysis
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ height: "100%", bgcolor: "#fcfcfd" }}>
          {selectedTreeData && (
            <Tree
              data={selectedTreeData}
              orientation="vertical"
              pathFunc="step"
              translate={{ x: window.innerWidth / 2, y: 100 }}
              renderCustomNodeElement={renderAdminNode} // We can reuse the node logic
              nodeSize={{ x: 250, y: 150 }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

// Reuse your clean node UI here...
const renderAdminNode = ({ nodeDatum, toggleNode }) => {
  const statusColor =
    nodeDatum.attributes?.status === "green"
      ? "#4caf50"
      : nodeDatum.attributes?.status === "yellow"
        ? "#ffeb3b"
        : "#f44336";
  return (
    <g>
      <circle r="12" fill={statusColor} stroke="#fff" strokeWidth="2" />
      <text
        fill="#333"
        x="20"
        dy="5"
        fontSize="12px"
        fontWeight="600"
        stroke="none"
      >
        {nodeDatum.name}
      </text>
    </g>
  );
};

export default UserManagementPage;
