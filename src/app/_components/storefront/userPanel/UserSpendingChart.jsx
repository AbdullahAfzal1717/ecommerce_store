import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";

const UserSpendingChart = ({ data }) => (
  <Paper sx={{ p: 3, borderRadius: 4, border: "1px solid #eee" }} elevation={0}>
    <Typography variant="h6" fontWeight="700" mb={3}>
      Spending Trend
    </Typography>
    <Box sx={{ height: 250, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data || []}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#2e7d32" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            dy={10}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
            formatter={(value) => [`Rs. ${value}`, "Total Spent"]}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#2e7d32"
            fillOpacity={1}
            fill="url(#colorSpent)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  </Paper>
);

export default UserSpendingChart;
