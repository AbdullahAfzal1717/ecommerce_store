import { JumboCard } from "@jumbo/components";
import { Typography } from "@mui/material";
import { OrdersReportChart } from "./OrderReportChart";
import PropTypes from "prop-types";

const OrdersReport = ({ title, subheader, chartHeight, subTitle, data }) => {
  return (
    <JumboCard
      title={
        <Typography variant={"h4"} mb={0}>
          {title}
        </Typography>
      }
      subheader={subTitle === null ? subTitle : subheader}
      sx={{
        height: "100%", // Force card to fill the Grid height
        width: "100%",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
      }}
      contentWrapper
      contentSx={{ pt: 0 }}
    >
      {/* Pass the dynamic report data here */}
      <OrdersReportChart height={chartHeight} data={data} />
    </JumboCard>
  );
};

export { OrdersReport };

OrdersReport.propTypes = {
  chartHeight: PropTypes.number,
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node.isRequired,
  subTitle: PropTypes.string,
};
