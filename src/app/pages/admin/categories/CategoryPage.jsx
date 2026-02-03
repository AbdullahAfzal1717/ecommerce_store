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
import { categoryService } from "@app/_services/category.service";
import CategoryTable from "@app/_components/admin/categories/CategoryTable";
import CategoryDialog from "@app/_components/admin/categories/CategoryDialog";
import ConfirmDialog from "@app/_utilities/helpers/ConfirmDialog"; // Using your helper
import { toast } from "@app/_components/_core/MessageProvider";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fetchingDetail, setFetchingDetail] = useState(false);

  // States for your ConfirmDialog helper
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data);
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = async (categoryRow) => {
    setFetchingDetail(true);
    try {
      const res = await categoryService.getById(categoryRow._id);
      setSelectedCategory(res.data);
      setOpenDialog(true);
    } catch (error) {
      toast.error("Could not fetch the latest category details");
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
      await categoryService.delete(deletingId);
      toast.success("Category deleted successfully");
      fetchCategories();
      setConfirmOpen(false);
    } catch (error) {
      toast.error("Failed to delete category. It might be linked to products.");
    } finally {
      setDeleteLoading(false);
      setDeletingId(null);
    }
  };

  return (
    <Div sx={{ p: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h2">Categories</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {fetchingDetail && <CircularProgress size={24} />}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedCategory(null);
              setOpenDialog(true);
            }}
          >
            Add New Category
          </Button>
        </Stack>
      </Stack>

      <Card>
        <CardContent>
          <CategoryTable
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      <CategoryDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedCategory(null);
        }}
        refresh={fetchCategories}
        editData={selectedCategory}
      />

      {/* Modern Confirmation Dialog via Helper Component */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Category?"
        content="Are you sure you want to delete this category? This action cannot be undone and may affect linked products."
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
        loading={deleteLoading}
      />
    </Div>
  );
};

export default CategoryPage;
