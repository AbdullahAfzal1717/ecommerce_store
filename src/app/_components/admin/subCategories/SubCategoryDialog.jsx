import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Stack, Button, Typography, IconButton, Box, Avatar, MenuItem } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { JumboForm, JumboInput } from "@jumbo/vendors/react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import { subcategoryService } from "@app/_services/subcategory.service";

const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    categoryId: yup.string().required("Please select a parent category"),
});

const SubCategoryDialog = ({ open, onClose, refresh, editData }) => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);

    // Fetch titles for the dropdown
    useEffect(() => {
        const fetchTitles = async () => {
            const res = await subcategoryService.getCategoryList();
            setCategories(res.data);
        };
        if (open) {
            setImageFile(null);
            fetchTitles()
        }
    }, [open]);

    const handleFormSubmit = async (data) => {
        setLoading(true);
        try {
            if (editData) {
                await subcategoryService.update(editData._id, { ...data, image: imageFile });
            } else {
                await subcategoryService.create({ ...data, image: imageFile });
            }
            refresh();
            onClose();
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h3">{editData ? "Edit Subcategory" : "Add Subcategory"}</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                <JumboForm 
                    key={editData?._id || 'new'} 
                    validationSchema={schema} 
                    onSubmit={handleFormSubmit}
                    
                >
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <JumboInput fieldName="categoryId" label="Parent Category" defaultValue={editData?.category?._id || ""} select fullWidth>
                            {categories.map((cat) => (
                                <MenuItem key={cat._id} value={cat._id}>{cat.title}</MenuItem>
                            ))}
                        </JumboInput>
                        <JumboInput fieldName="title" label="Subcategory Title" defaultValue={editData?.title || ""} fullWidth />
                        <JumboInput fieldName="description" label="Description" defaultValue={editData?.description || ""} multiline rows={2} fullWidth />
                        <Box>
                            {editData?.image && !imageFile && <Avatar src={editData.image} variant="rounded" sx={{ mb: 1 }} />}
                            <Button variant="outlined" component="label" fullWidth>
                                {imageFile ? imageFile.name : "Upload Image"}
                                <input type="file" hidden accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                            </Button>
                        </Box>
                        <LoadingButton loading={loading} type="submit" variant="contained" fullWidth>Save</LoadingButton>
                    </Stack>
                </JumboForm>
            </DialogContent>
        </Dialog>
    );
};

export default SubCategoryDialog;