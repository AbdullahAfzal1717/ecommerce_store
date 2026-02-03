import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { Div } from "@jumbo/shared";
import AddIcon from "@mui/icons-material/Add";
import { productService } from "@app/_services/product.service";
import ProductTable from "@app/_components/admin/products/ProductTable";
import ProductDialog from "@app/_components/admin/products/ProductDialog";
import ProductDetailsDrawer from "@app/_components/admin/products/ProductDetailsDrawer";
import ConfirmDialog from "@app/_utilities/helpers/ConfirmDialog"; // Your helper
import { toast } from "@app/_components/_core/MessageProvider";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [fetchingDetail, setFetchingDetail] = useState(false);

  // Delete Modal States
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await productService.getAll();
      setProducts(res.data);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = async (productRow) => {
    setFetchingDetail(true);
    try {
      const res = await productService.getById(productRow._id);
      setSelectedProduct(res.data);
      setOpenDialog(true);
    } catch (error) {
      toast.error("Could not fetch product details");
    } finally {
      setFetchingDetail(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await productService.delete(deletingId);
      toast.success("Product removed successfully");
      fetchProducts();
      setConfirmOpen(false);
    } catch (error) {
      toast.error("Error deleting product");
    } finally {
      setDeleteLoading(false);
      setDeletingId(null);
    }
  };

  return (
    <Div sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography variant="h2">Inventory Management</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {fetchingDetail && <CircularProgress size={24} />}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedProduct(null);
              setOpenDialog(true);
            }}
          >
            Add New Product
          </Button>
        </Stack>
      </Stack>

      <Card>
        <CardContent>
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onViewDetail={(prod) => setViewProduct(prod)}
          />
        </CardContent>
      </Card>

      <ProductDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedProduct(null);
        }}
        refresh={fetchProducts}
        editData={selectedProduct}
      />

      <ProductDetailsDrawer
        open={Boolean(viewProduct)}
        product={viewProduct}
        onClose={() => setViewProduct(null)}
      />

      {/* Using your custom Helper Component */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Product?"
        content="Are you sure you want to remove this product? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
        loading={deleteLoading}
      />
    </Div>
  );
};

export default ProductPage;
