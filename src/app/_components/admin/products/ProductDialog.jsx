import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Button,
  MenuItem,
  Box,
  Typography,
  Grid,
  IconButton,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { JumboForm, JumboInput } from "@jumbo/vendors/react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";
import { productService } from "@app/_services/product.service";
import { toast } from "@app/_components/_core/MessageProvider"; // Added import

const ProductDialog = ({ open, onClose, refresh, editData }) => {
  const [loading, setLoading] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (open) {
      productService
        .getSubCategoryList()
        .then((res) => setSubCategories(res.data));

      if (editData) {
        setExistingImages(editData.images || []);
      } else {
        setExistingImages([]);
      }
      setNewImageFiles([]);
    }
  }, [open, editData]);

  useEffect(() => {
    return () => {
      newImageFiles.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [newImageFiles]);

  const removeExistingImage = (urlToRemove) => {
    setExistingImages((prev) => prev.filter((url) => url !== urlToRemove));
    toast.info("Image removed from current list"); // Added notification
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setNewImageFiles((prev) => [...prev, ...selectedFiles].slice(0, 5));
    toast.success("Images added to preview"); // Added notification
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        images: newImageFiles,
        existingImages: existingImages,
      };

      if (editData) {
        await productService.update(editData._id, payload);
        toast.success("Product updated successfully!"); // Added Success Toast
      } else {
        await productService.create(payload);
        toast.success("New product added to inventory!"); // Added Success Toast
      }

      refresh();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Submission failed"); // Replaced console.error
    } finally {
      setLoading(false);
      newImageFiles.forEach((file) => URL.revokeObjectURL(file.preview));
      setNewImageFiles([]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h3" mb={0}>
            {editData ? "Edit Product" : "Add Product"}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <JumboForm key={editData?._id || "new"} onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <JumboInput
                  fieldName="title"
                  label="Product Name"
                  defaultValue={editData?.title || ""}
                  fullWidth
                />
                <JumboInput
                  fieldName="subCategory"
                  label="Sub Category"
                  select
                  fullWidth
                  defaultValue={editData?.subCategory?._id || ""}
                >
                  {subCategories.map((sc) => (
                    <MenuItem key={sc._id} value={sc._id}>
                      {sc.title}
                    </MenuItem>
                  ))}
                </JumboInput>
                <Stack direction="row" spacing={2}>
                  <JumboInput
                    fieldName="price"
                    label="Price"
                    type="number"
                    defaultValue={editData?.price || ""}
                    fullWidth
                  />
                  <JumboInput
                    fieldName="quantity"
                    label="Stock Qty"
                    type="number"
                    defaultValue={editData?.quantity || ""}
                    fullWidth
                  />
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <JumboInput
                fieldName="description"
                label="Description"
                multiline
                defaultValue={editData?.description || ""}
                rows={4}
                fullWidth
              />

              <Box mt={3}>
                <Typography variant="h6" mb={1}>
                  Current Images
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                  {existingImages.map((url, idx) => (
                    <Box key={idx} sx={{ position: "relative" }}>
                      <Avatar
                        src={url}
                        variant="rounded"
                        sx={{ width: 60, height: 60, border: "1px solid #eee" }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeExistingImage(url)}
                        sx={{
                          position: "absolute",
                          top: -5,
                          right: -5,
                          bgcolor: "error.main",
                          color: "white",
                          width: 20,
                          height: 20,
                          "&:hover": { bgcolor: "error.dark" },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                  {newImageFiles.map((file, index) => (
                    <Box key={index} sx={{ position: "relative" }}>
                      <Avatar
                        src={URL.createObjectURL(file)}
                        variant="rounded"
                        sx={{ width: 56, height: 56 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeNewImage(index)}
                        sx={{
                          position: "absolute",
                          top: -10,
                          right: -10,
                          bgcolor: "error.main",
                          color: "white",
                          "&:hover": { bgcolor: "error.dark" },
                        }}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>

                <Button variant="outlined" component="label" fullWidth>
                  Add More Images
                  <input
                    type="file"
                    multiple
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
            </Grid>
          </Grid>
          <LoadingButton
            loading={loading}
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            {editData ? "Update Product" : "Save Product"}
          </LoadingButton>
        </JumboForm>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
