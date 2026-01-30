import React from "react";
import { Div } from "@jumbo/shared";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  List,
} from "@mui/material";
import {
  Legend,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

const ListItemInline = styled(ListItem)(({ theme }) => ({
  width: "auto",
  display: "inline-flex",
  padding: theme.spacing(0, 1), // Increased spacing for better look
}));

// FIXED LEGEND: Now explicitly checks the name to assign the correct color
const renderLegend = (props) => {
  const { payload } = props;

  return (
    <List
      disablePadding
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: 2,
      }}
    >
      {payload?.map((entry, index) => {
        // Explicitly check the name sent from the <Radar name="..." />
        const iconColor = entry.value === "Completed" ? "#3f51b5" : "#ec407a";

        return (
          <ListItemInline key={`item-${index}`}>
            <ListItemIcon sx={{ minWidth: 20 }}>
              {/* USE htmlColor OR style TO OVERRIDE THE THEME DEFAULTS */}
              <FiberManualRecordIcon
                htmlColor={iconColor}
                style={{ fontSize: "14px" }}
              />
            </ListItemIcon>
            <ListItemText
              primary={entry.value}
              primaryTypographyProps={{
                variant: "body2",
                fontWeight: "600",
                sx: { color: iconColor }, // Optional: colors the text too for extra clarity
              }}
            />
          </ListItemInline>
        );
      })}
    </List>
  );
};

const OrdersReportChart = ({ height, data }) => {
  return (
    <Div sx={{ pb: 3 }}>
      <ResponsiveContainer height={height ? height : 250}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarRadiusAxis
            angle={30}
            domain={[0, "auto"]}
            tick={{ fontSize: 10 }}
          />

          {/* RADAR 1: Completed (B) */}
          <Radar
            name="Completed"
            dataKey="B"
            stroke="#3f51b5"
            fill="#3f51b5"
            fillOpacity={0.5}
          />

          {/* RADAR 2: Pending (A) */}
          <Radar
            name="Pending"
            dataKey="A"
            stroke="#ec407a"
            fill="#ec407a"
            fillOpacity={0.5}
          />

          <Legend content={renderLegend} verticalAlign="bottom" />
        </RadarChart>
      </ResponsiveContainer>
    </Div>
  );
};

export { OrdersReportChart };
