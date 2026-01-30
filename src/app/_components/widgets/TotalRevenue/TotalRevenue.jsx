import { OnlineSignupChart } from "./Chart"; // Assuming this is a sparkline
import { JumboCard } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import { Chip } from "@mui/material";
import PropTypes from "prop-types";

function TotalRevenueThisYear({ revenue, subheader, chartData }) {
  // Get current year dynamically
  const currentYear = new Date().getFullYear();

  return (
    <JumboCard
      title={`Rs. ${Number(revenue).toLocaleString()}`} // Format with commas
      subheader={subheader}
      action={
        <Chip
          size={"small"}
          label={currentYear}
          sx={{
            bgcolor: "#F5F7FA",
            fontWeight: "bold",
            height: "100%", // Force card to fill the Grid height
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        />
      }
      textColor="common.white"
      bgcolor={["#f4a3ac", "#e73145"]} // Nice red gradient
      reverse
      sx={{
        borderTop: "4px solid #E73145",
        height: "100%",
        ".MuiCardHeader-title": {
          color: "inherit",
          fontSize: "1.5rem",
          fontWeight: "800",
        },
        ".MuiCardHeader-subheader": {
          color: "inherit",
          opacity: 0.8,
        },
      }}
    >
      <Div sx={{ p: 3, pb: 0 }}>
        {/* Pass your real data to the sparkline if it supports it, 
            otherwise it stays as a decorative element */}
        <OnlineSignupChart data={chartData} />
      </Div>
    </JumboCard>
  );
}

export { TotalRevenueThisYear };

TotalRevenueThisYear.propTypes = {
  revenue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subheader: PropTypes.string.isRequired,
  chartData: PropTypes.array,
};
