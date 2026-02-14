import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  Stack,
  IconButton,
} from "@mui/material";
import { ZoomIn, ZoomOut, CenterFocusStrong } from "@mui/icons-material";
import api from "@app/_services/api";

const ReferralTreePage = () => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const response = await api.get("/auth/referral-tree");
        setTreeData(response.data.data);
      } catch (error) {
        console.error("Error fetching tree:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTree();
  }, []);

  // Custom Node Styling based on Status
  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    const statusColor =
      nodeDatum.attributes?.status === "green"
        ? "#4caf50"
        : nodeDatum.attributes?.status === "yellow"
          ? "#ffeb3b"
          : "#f44336";

    return (
      <g>
        <circle
          r="20"
          fill={statusColor}
          onClick={toggleNode}
          stroke="#fff"
          strokeWidth="3"
          style={{
            cursor: "pointer",
            filter: "drop-shadow(0px 3px 3px rgba(0,0,0,0.2))",
          }}
        />
        <Tooltip
          arrow
          title={
            <Box p={1}>
              <Typography variant="body2">
                <b>Email:</b> {nodeDatum.attributes.email}
              </Typography>
              <Typography variant="body2">
                <b>Joined:</b> {nodeDatum.attributes.joined}
              </Typography>
              <Typography variant="body2">
                <b>Status:</b> {nodeDatum.attributes.status.toUpperCase()}
              </Typography>
            </Box>
          }
        >
          <text
            fill="black"
            x="25"
            dy="5"
            fontWeight="bold"
            fontSize="14"
            style={{ pointerEvents: "auto" }}
          >
            {nodeDatum.name}
          </text>
        </Tooltip>
      </g>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h3" fontWeight="900" color="primary">
            My Network
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visual breakdown of your referrals and their activity status.
          </Typography>
        </Box>

        {/* Status Legend */}
        <Paper variant="outlined" sx={{ p: 1, px: 2, borderRadius: 3 }}>
          <Stack direction="row" spacing={2}>
            <StatusDot color="#4caf50" label="Active" />
            <StatusDot color="#ffeb3b" label="Pending" />
            <StatusDot color="#f44336" label="Inactive" />
          </Stack>
        </Paper>
      </Stack>

      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          width: "100%",
          height: "70vh",
          borderRadius: 4,
          overflow: "hidden",
          bgcolor: "#f9fafb",
          position: "relative",
        }}
      >
        {treeData ? (
          <Tree
            data={treeData}
            orientation="vertical"
            pathFunc="step"
            translate={{ x: 400, y: 50 }}
            renderCustomNodeElement={renderCustomNode}
            nodeSize={{ x: 200, y: 150 }}
            separation={{ siblings: 1.5, nonSiblings: 2 }}
          />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography>No referrals found yet.</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

// Small Helper Component
const StatusDot = ({ color, label }) => (
  <Stack direction="row" alignItems="center" spacing={0.5}>
    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color }} />
    <Typography variant="caption" fontWeight="bold">
      {label}
    </Typography>
  </Stack>
);

export default ReferralTreePage;
