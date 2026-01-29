import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, CircularProgress, Button } from "@mui/material";
import { productService } from "@app/_services/product.service";
import ProductCard from "../products/ProductCard";
import { useNavigate } from "react-router-dom";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await productService.getAll();
        // Show only latest 8 for clean landing page
        setProducts(response.data.slice(0, 8));
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  return (
    <Box sx={{ py: 10 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" fontWeight="800" gutterBottom>
          NEW ARRIVALS
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Check out the latest tech gadgets added to our collection
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      <Box display="flex" justifyContent="center" mt={8}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/products")}
          sx={{
            bgcolor: "black",
            color: "white",
            px: 6,
            py: 1.5,
            "&:hover": { bgcolor: "#333" },
          }}
        >
          View All Products
        </Button>
      </Box>
    </Box>
  );
};

export default NewArrivals;
