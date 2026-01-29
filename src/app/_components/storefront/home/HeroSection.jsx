import { Grid, Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <Grid container spacing={2} sx={{ height: { md: "600px" } }}>
        {/* Left Image */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              bgcolor: "#F3F3F3",
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1620783770629-122b7f187703?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="tech"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        </Grid>

        {/* Center Content */}
        <Grid item xs={12} md={6}>
          <Stack
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ height: "100%", textAlign: "center" }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "3rem", md: "5rem" },
                letterSpacing: -2,
              }}
            >
              ULTIMATE <br /> <span style={{ color: "#888" }}>TECH</span> SALE
            </Typography>
            <Typography variant="body1" color="text.secondary">
              NEW COLLECTION 2026
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: "black",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
              onClick={() => {
                navigate("/products");
              }}
            >
              SHOP NOW
            </Button>
            <Box
              sx={{ mt: 4, width: "100%", bgcolor: "#F3F3F3", height: "200px" }}
            >
              <img
                src="https://images.unsplash.com/photo-1486611367184-17759508999c?q=80&w=773&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="gadgets"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </Stack>
        </Grid>

        {/* Right Image */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              bgcolor: "#F3F3F3",
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="tech"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeroSection;
