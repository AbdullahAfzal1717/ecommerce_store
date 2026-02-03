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
import { subcategoryService } from "@app/_services/subcategory.service";
import SubCategoryTable from "@app/_components/admin/subCategories/SubCategoryTable";
import SubCategoryDialog from "@app/_components/admin/subCategories/SubCategoryDialog";
import ConfirmDialog from "@app/_utilities/helpers/ConfirmDialog"; // Your helper
import { toast } from "@app/_components/_core/MessageProvider";

const SubCategoryPage = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadData = async () => {
    try {
      const res = await subcategoryService.getAll();
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load subcategories");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = async (row) => {
    setLoading(true);
    try {
      const res = await subcategoryService.getById(row._id);
      setSelected(res.data);
      setOpen(true);
    } catch (error) {
      toast.error("Error fetching details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await subcategoryService.delete(deletingId);
      toast.success("Subcategory deleted");
      loadData();
      setConfirmOpen(false);
    } catch (error) {
      toast.error("Delete failed. Check for linked products.");
    } finally {
      setDeleteLoading(false);
      setDeletingId(null);
    }
  };

  return (
    <Div sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography variant="h2">Subcategories</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {loading && <CircularProgress size={24} />}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
          >
            Add New
          </Button>
        </Stack>
      </Stack>
      <Card>
        <CardContent>
          <SubCategoryTable
            subcategories={data}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      <SubCategoryDialog
        open={open}
        onClose={() => setOpen(false)}
        refresh={loadData}
        editData={selected}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Subcategory?"
        content="Are you sure? This might affect products categorized under this title."
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
        loading={deleteLoading}
      />
    </Div>
  );
};

export default SubCategoryPage;
