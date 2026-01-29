import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Grid,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Close,
  Add,
  Remove,
  ShoppingCartOutlined,
  LocalShippingOutlined,
} from "@mui/icons-material";
import { useCart } from "@app/_components/_core/CartProvider/hooks";
import { useNavigate } from "react-router-dom";

const ProductDetailDrawer = ({ product, open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { addToCart } = useCart();
  const stockStatus = getStockStatus(product?.quantity);
  const navigate = useNavigate();

  // Manage which image is currently selected
  const [selectedImg, setSelectedImg] = useState(0);
  const [buyQty, setBuyQty] = useState(1);
  const isOutOfStock = product?.quantity <= 0;

  useEffect(() => {
    if (!open) {
      // When the dialog closes, wait a tiny bit (for the animation to finish)
      // then reset to base values
      const timer = setTimeout(() => {
        setSelectedImg(0);
        setBuyQty(1);
      }, 300); // 300ms matches the default Material UI transition

      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, buyQty);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, buyQty);
    navigate("/checkout");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth scroll="body">
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8, zIndex: 10 }}
      >
        <Close />
      </IconButton>

      <DialogContent sx={{ p: { xs: 2, md: 5 } }}>
        <Grid container spacing={4}>
          {/* Left: Images Section (Vertical Gallery) */}
          {/* Left: Images Section */}
          <Grid item xs={12} md={7}>
            <Stack
              // Desktop: Row (Thumbnails Left, Image Right)
              // Mobile: Column (Image Top, Thumbnails Bottom)
              direction={isMobile ? "column" : "row"}
              spacing={2}
              sx={{ height: isMobile ? "auto" : 500 }}
            >
              {/* 1. THUMBNAILS LIST */}
              <Stack
                direction={isMobile ? "row" : "column"}
                spacing={2}
                // order: 2 on mobile moves thumbnails below the image
                // order: 1 on desktop keeps them on the left
                sx={{
                  order: isMobile ? 2 : 1,
                  overflowX: isMobile ? "auto" : "hidden",
                  overflowY: isMobile ? "hidden" : "auto",
                  pb: isMobile ? 1 : 0,
                  pr: isMobile ? 0 : 1,
                  minWidth: isMobile ? "100%" : "80px",
                  "&::-webkit-scrollbar": { height: "4px", width: "2px" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#ddd",
                    borderRadius: "10px",
                  },
                }}
              >
                {product.images?.map((img, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={img}
                    onClick={() => setSelectedImg(index)}
                    sx={{
                      width: isMobile ? 70 : 70,
                      height: isMobile ? 70 : 90,
                      objectFit: "cover",
                      borderRadius: "4px",
                      cursor: "pointer",
                      flexShrink: 0,
                      border:
                        selectedImg === index
                          ? "2px solid #000"
                          : "1px solid #ddd",
                      transition: "0.2s",
                    }}
                  />
                ))}
              </Stack>

              {/* 2. MAIN LARGE IMAGE */}
              <Box
                sx={{
                  order: isMobile ? 1 : 2, // Image comes first on Mobile
                  flexGrow: 1,
                  bgcolor: "#f9f9f9",
                  borderRadius: "8px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: isMobile ? 350 : "100%",
                  width: "100%",
                }}
              >
                <Box
                  component="img"
                  src={product?.images?.[selectedImg] || product?.images?.[0]}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Stack>
          </Grid>
          {/* Right: Info Section */}
          <Grid item xs={12} md={5}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textTransform: "uppercase", mb: 1 }}
            >
              {product.subCategory?.title || "Collection"}
            </Typography>
            <Typography variant="h3" fontWeight="700" sx={{ mb: 2 }}>
              {product.title}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography variant="h4" fontWeight="800" color="primary">
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
            </Stack>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, lineHeight: 1.7 }}
            >
              {product.description}
            </Typography>

            <Divider sx={{ mb: 4 }} />

            {/* Quantity Selector */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ mb: 1.5 }}
              >
                QUANTITY
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  border: "1px solid #ddd",
                  width: "fit-content",
                  borderRadius: "4px",
                  p: 0.5,
                }}
              >
                <IconButton
                  disabled={isOutOfStock}
                  size="small"
                  onClick={() => setBuyQty((q) => Math.max(1, q - 1))}
                >
                  <Remove />
                </IconButton>
                <Typography
                  disabled={isOutOfStock}
                  sx={{ px: 2, fontWeight: "bold" }}
                >
                  {isOutOfStock ? 0 : buyQty}
                </Typography>
                <IconButton
                  disabled={isOutOfStock}
                  size="small"
                  onClick={() =>
                    setBuyQty((q) => Math.min(product.quantity, q + 1))
                  }
                >
                  <Add />
                </IconButton>
              </Stack>
            </Box>

            {/* Action Buttons */}
            <Stack spacing={2}>
              <Button
                disabled={isOutOfStock}
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                sx={{
                  py: 1.5,
                  borderColor: "#000",
                  color: "#000",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                Add to cart
              </Button>
              <Button
                disabled={isOutOfStock}
                variant="contained"
                fullWidth
                size="large"
                onClick={handleBuyNow}
                sx={{
                  py: 1.5,
                  bgcolor: "#000",
                  "&:hover": { bgcolor: "#333" },
                }}
              >
                Buy Now
              </Button>
            </Stack>

            {/* Extra Info */}
            <Stack spacing={1} sx={{ mt: 4 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <LocalShippingOutlined fontSize="small" />
                <Typography variant="body2">
                  Estimated Delivery: 3-5 Working Days
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const getStockStatus = (qty) => {
  if (qty <= 0)
    return { label: "OUT OF STOCK", color: "#d63031", bg: "#fab1a033" };
  if (qty < 10)
    return { label: `ONLY ${qty} LEFT`, color: "#e17055", bg: "#ffeaa733" };
  return { label: "IN STOCK", color: "#00b894", bg: "#55efc433" };
};

export default ProductDetailDrawer;
