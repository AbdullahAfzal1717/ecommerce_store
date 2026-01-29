import { Stack, Typography, Box } from "@mui/material";

const BrandStrip = () => {
  const brands = ["APPLE", "SAMSUNG", "SONY", "DELL", "RAZER"];
  return (
    <Box sx={{ py: 6, borderY: "1px solid #EEE" }}>
      <Stack direction="row" justifyContent="space-around" alignItems="center">
        {brands.map((brand) => (
          <Typography
            key={brand}
            variant="h5"
            sx={{ fontWeight: 900, color: "#CCC", cursor: "default" }}
          >
            {brand}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
};

export default BrandStrip;
