import { Div } from "@jumbo/shared";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Paper, Typography } from "@mui/material";

const ChartSalesOverview = ({ chartData }) => {
  return (
    <ResponsiveContainer height={250}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          {/* Gradient for Revenue (Purple) */}
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#51459E" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#51459E" stopOpacity={0} />
          </linearGradient>
          {/* Gradient for Orders (Orange) */}
          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F39711" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#F39711" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* X-Axis shows the months (hKey) */}
        <XAxis
          dataKey="hKey"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#999" }}
        />

        {/* Y-Axis hidden for a cleaner "Dashboard" look, but stays in logic */}
        <YAxis hide={true} />

        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Paper
                  sx={{
                    p: 1.5,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    border: "none",
                  }}
                >
                  <Typography
                    variant="caption"
                    display="block"
                    color="textSecondary"
                    sx={{ mb: 1, fontWeight: "bold" }}
                  >
                    {payload[0].payload.hKey} 2025
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#51459E", fontWeight: 700 }}
                  >
                    Revenue: Rs. {payload[0].value.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#F39711", fontWeight: 700 }}
                  >
                    Orders: {payload[1].value}
                  </Typography>
                </Paper>
              );
            }
            return null;
          }}
        />

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          strokeOpacity={0.1}
        />

        {/* Main Area: Revenue */}
        <Area
          name="Revenue"
          type="monotone"
          dataKey="revenue" // Changed from Max
          stroke="#51459E"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />

        {/* Secondary Area: Orders */}
        <Area
          name="Orders"
          type="monotone"
          dataKey="orders" // Changed from Min
          stroke="#F39711"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorOrders)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export { ChartSalesOverview };
