import { Box, Typography, Button, Stack, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DealsSection = () => {
  const navigate = useNavigate();

  const TimeUnit = ({ value, label }) => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1, sm: 2 },
        textAlign: "center",
        border: "1px solid #EEE",
        // Changed minWidth to flex: 1 to allow shrinking, and added maxWidth
        flex: 1,
        maxWidth: { xs: "70px", sm: "100px" },
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ fontSize: { xs: "1.2rem", sm: "1.8rem", md: "2.125rem" } }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        sx={{ fontSize: { xs: "0.6rem", sm: "0.75rem" } }}
      >
        {label}
      </Typography>
    </Paper>
  );

  return (
    // overflow: hidden prevents the Grid's negative margin from causing a scrollbar
    <Box sx={{ py: { xs: 6, md: 10 }, overflow: "hidden" }}>
      <Grid container spacing={{ xs: 4, lg: 8 }} alignItems="center">
        {/* TEXT CONTENT COLUMN */}
        <Grid item xs={12} md={5}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              }}
              gutterBottom
            >
              Deals Of The Month
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Get the latest gadgets at unbeatable prices. Limited time offer
              for our tech community.
            </Typography>

            {/* use flexWrap: "wrap" so boxes move to next line if screen is tiny */}
            <Stack
              direction="row"
              spacing={{ xs: 1, sm: 2 }}
              mb={4}
              sx={{ width: "100%" }}
            >
              <TimeUnit value="02" label="Days" />
              <TimeUnit value="06" label="Hours" />
              <TimeUnit value="05" label="Mins" />
              <TimeUnit value="30" label="Secs" />
            </Stack>

            <Button
              variant="contained"
              onClick={() => navigate("/products")}
              sx={{
                bgcolor: "black",
                px: 6,
                py: 1.5,
                "&:hover": { bgcolor: "#333" },
              }}
            >
              Buy Now
            </Button>
          </Box>
        </Grid>

        {/* IMAGES COLUMN */}
        <Grid item xs={12} md={7}>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 2 },
              width: "100%",
              // Ensure images don't force the container to be wider than the screen
              boxSizing: "border-box",
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1486611367184-17759508999c?q=80&w=773&auto=format&fit=crop"
              alt="Tech Deal 1"
              sx={{
                // calc(50% - gap) ensures the images stay side-by-side without overflowing
                width: "calc(50% - 8px)",
                height: { xs: "200px", sm: "300px", lg: "400px" },
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=870&auto=format&fit=crop"
              alt="Tech Deal 2"
              sx={{
                width: "calc(50% - 8px)",
                height: { xs: "200px", sm: "300px", lg: "400px" },
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DealsSection;
