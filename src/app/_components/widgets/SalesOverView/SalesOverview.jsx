import React from "react";
import { JumboCard } from "@jumbo/components";
import { Button, Stack, Typography, Box } from "@mui/material";
import { ChartSalesOverview } from "./components"; // Double check this path!

function SalesOverview({ title, data }) {

  return (
    <JumboCard
      title={title}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      action={
        <Stack direction={"row"} spacing={1}>
          <Button size={"small"} variant={"contained"}>
            Monthly
          </Button>
        </Stack>
      }
    >
      {/* IMPORTANT: Remove the loading ? spinner logic. 
        If data is undefined or empty, show a message, otherwise RENDER THE CHART.
      */}
      {data && data.length > 0 ? (
        <ChartSalesOverview chartData={data} />
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={192}
        >
          <Typography color="textSecondary">Waiting for data...</Typography>
        </Box>
      )}
    </JumboCard>
  );
}

export { SalesOverview };
