import { JumboCard } from "@jumbo/components/JumboCard";
import { Div } from "@jumbo/shared";
import { Typography } from "@mui/material";
import { ChartOrders } from "./components/incex";
import PropTypes from "prop-types";

function Orders({ title, count, data }) {
  return (
    <JumboCard
      title={
        <Typography variant={"h5"} mb={0.5}>
          {title}
        </Typography>
      }
      subheader={
        <Typography variant={"h6"} color={"text.secondary"}>
          {count}
        </Typography>
      }
      headerSx={{ pb: 0 }}
      sx={{
        height: "100%", // Force card to fill the Grid height
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Div sx={{ mt: -2.5 }}>
        {/* It uses the same chartData from the main dashboard */}
        <ChartOrders data={data} />
      </Div>
    </JumboCard>
  );
}

export { Orders };

Orders.propTypes = {
  title: PropTypes.node.isRequired,
};
