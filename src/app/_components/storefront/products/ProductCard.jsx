import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useCart } from "@app/_components/_core/CartProvider/hooks";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onOpenDetails }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const isOutOfStock = product.quantity <= 0;
  const stockStatus = getStockStatus(product.quantity);

  const handleDirectBuy = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    navigate("/checkout");
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        border: "1px solid #eeeeee", // Subtle border
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)", // Soft professional shadow
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#fff",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.1)", // Deeper shadow on hover
          "& .hover-bar": { transform: "translateY(0)" },
        },
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          position: "relative",
          bgcolor: "#fcfcfc",
          aspectRatio: "1 / 1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <CardMedia
          onClick={(e) => {
            onOpenDetails(product);
          }}
          component="img"
          image={product.images?.[0] || "https://via.placeholder.com/400"}
          alt={product.title}
          sx={{
            cursor: "pointer",
            width: "100%",
            height: "100%",
            objectFit: "cover", // Keeps original ratio but fits inside
            transition: "transform 0.5s ease",
            "&:hover": { transform: "scale(1.1)" }, // Image zoom effect
          }}
        />

        {/* The Hover Action Bar */}
        <Box
          disabled={isOutOfStock}
          className="hover-bar"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "rgba(0, 0, 0, 0.85)",
            color: "white",
            p: "12px",
            display: `${isOutOfStock ? "none" : "flex"}`,
            alignItems: "center",
            justifyContent: "space-between",
            transform: "translateY(100%)",
            transition: "transform 0.3s ease",
            zIndex: 3,
          }}
        >
          <Stack direction="row" spacing={1}>
            <IconButton
              disabled={isOutOfStock}
              size="small"
              sx={{ color: "white", "&:hover": { color: "#ff6b6b" } }}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
            >
              <ShoppingCartIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Button
            disabled={isOutOfStock}
            onClick={handleDirectBuy}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: "12px",
              "&:hover": { bgcolor: "transparent", color: "#4dabf5" },
            }}
          >
            BUY NOW
          </Button>
        </Box>
      </Box>

      {/* Product Information */}
      <CardContent sx={{ p: 2, flexGrow: 1 }}>
        {/* 1. Subcategory Label (Restored) */}
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            textTransform: "uppercase",
            fontWeight: 600,
            letterSpacing: "1px",
            display: "block",
            mb: 0.5,
          }}
        >
          {product.subCategory?.title ||
            product.subCategory?.name ||
            "Collection"}
        </Typography>

        {/* 2. Product Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem",
            lineHeight: 1.3,
            color: "#2d3436",
            mb: 1,
            // Clamp to 2 lines so card height stays even
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            height: "2.8rem",
          }}
        >
          {product.title}
        </Typography>

        {/* 3. Price and Stock Row */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          mt="auto"
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "primary.main" }}
          >
            ${product.price.toFixed(2)}
          </Typography>

          {stockStatus.label && (
            <Typography
              sx={{
                fontSize: "11px",
                color: stockStatus.color,
                fontWeight: 700,
                bgcolor: stockStatus.bg,
                px: 1,
                borderRadius: "4px",
              }}
            >
              {stockStatus.label}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const getStockStatus = (qty) => {
  if (qty <= 0)
    return { label: "OUT OF STOCK", color: "#d63031", bg: "#fab1a033" };
  if (qty < 10)
    return { label: `ONLY ${qty} LEFT`, color: "#e17055", bg: "#ffeaa733" };
  return { label: "IN STOCK", color: "#00b894", bg: "#55efc433" };
};

export default ProductCard;
