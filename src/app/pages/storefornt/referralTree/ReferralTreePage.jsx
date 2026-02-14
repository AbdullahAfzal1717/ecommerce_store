import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Tooltip,
  Stack,
  Divider,
} from "@mui/material";
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

  // Clean UI fix for the Node and Label
  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    const statusColor =
      nodeDatum.attributes?.status === "green"
        ? "#4caf50"
        : nodeDatum.attributes?.status === "yellow"
          ? "#ffeb3b"
          : "#f44336";

    return (
      <g>
        {/* Transparent outer circle to make clicking/hovering easier */}
        <circle
          r="25"
          fill="transparent"
          style={{ cursor: "pointer" }}
          onClick={toggleNode}
        />

        {/* The Actual Status Dot */}
        <circle
          r="10"
          fill={statusColor}
          stroke="#fff"
          strokeWidth="2"
          style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" }}
        />

        {/* TEXT FIX: Removed 'stroke' and 'strokeWidth' to prevent "ink splash" effect */}
        <text
          fill="#374151"
          x="18"
          dy="5"
          fontSize="13px"
          fontWeight="600"
          stroke="none"
          style={{
            fontFamily: "Inter, Roboto, sans-serif",
            pointerEvents: "none",
          }}
        >
          {nodeDatum.name}
        </text>

        {/* Hover Tooltip trigger area */}
        <Tooltip
          arrow
          placement="right"
          title={
            <Box p={1.5} sx={{ minWidth: 160 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  pb: 0.5,
                }}
              >
                {nodeDatum.name}
              </Typography>
              <Stack spacing={0.8}>
                <Typography
                  variant="caption"
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <b>Status:</b>{" "}
                  <span>{nodeDatum.attributes.status.toUpperCase()}</span>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <b>Joined:</b> <span>{nodeDatum.attributes.joined}</span>
                </Typography>
              </Stack>
            </Box>
          }
        >
          <circle r="20" fill="transparent" style={{ cursor: "help" }} />
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
        <CircularProgress thickness={5} size={50} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        mb={4}
      >
        <Box>
          <Typography
            variant="h2"
            fontWeight="900"
            color="primary"
            sx={{ letterSpacing: -1 }}
          >
            Network Tree
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your unilevel downline and track individual referral
            performance.
          </Typography>
        </Box>

        <Paper
          variant="outlined"
          sx={{ p: 1.5, px: 3, borderRadius: 4, bgcolor: "background.paper" }}
        >
          <Stack direction="row" spacing={3}>
            <StatusDot color="#4caf50" label="Active (Green)" />
            <StatusDot color="#ffeb3b" label="Pending (Yellow)" />
            <StatusDot color="#f44336" label="Inactive (Red)" />
          </Stack>
        </Paper>
      </Stack>

      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          width: "100%",
          height: "72vh",
          borderRadius: 6,
          overflow: "hidden",
          bgcolor: "#fcfcfd", // Very light tint for contrast
          position: "relative",
          border: "1px solid #e5e7eb",
          // Custom CSS for the connecting lines
          "& .rd3t-link": {
            stroke: "#d1d5db",
            strokeWidth: 1.5,
          },
        }}
      >
        {treeData ? (
          <Tree
            data={treeData}
            orientation="vertical"
            pathFunc="step"
            translate={{ x: 500, y: 50 }}
            renderCustomNodeElement={renderCustomNode}
            nodeSize={{ x: 220, y: 120 }}
            separation={{ siblings: 1.2, nonSiblings: 2 }}
            enableLegacyTransition={true}
            transitionDuration={600}
          />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography variant="h6" color="text.disabled">
              No network data available.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

const StatusDot = ({ color, label }) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        bgcolor: color,
        border: "2px solid #fff",
        boxShadow: "0 0 0 1px #e5e7eb",
      }}
    />
    <Typography variant="caption" fontWeight="700" sx={{ color: "#4b5563" }}>
      {label}
    </Typography>
  </Stack>
);

export default ReferralTreePage;
