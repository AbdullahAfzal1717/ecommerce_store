import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Stack, Button, Typography, IconButton, Box, Avatar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { JumboForm, JumboInput } from "@jumbo/vendors/react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import { categoryService } from "@app/_services/category.service";
import { Div } from "@jumbo/shared";

const schema = yup.object().shape({
    title: yup.string().required("Title is required").min(3, "Too short"),
    description: yup.string().required("Description is required").min(10, "Too short"),
});

const CategoryDialog = ({ open, onClose, refresh, editData }) => {
    const [loading, setLoading] = React.useState(false);
    const [imageFile, setImageFile] = React.useState(null);


    const handleFormSubmit = async (data) => {
        setLoading(true);
        try {
            if (editData) {
                // Logic for UPDATE
                await categoryService.update(editData._id, { ...data, image: imageFile });
            } else {
                // Logic for CREATE
                await categoryService.create({ ...data, image: imageFile });
            }
            
            setImageFile(null); 
            refresh(); 
            onClose(); 
        } catch (error) {
            console.error("Operation failed:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(()=>{
        if (open) {
            setImageFile(null);
        }
    },[open])

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h3" mb={0}>
                        {editData ? "Edit Category" : "Add New Category"}
                    </Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                <JumboForm 
                    key={editData?._id || 'new'} // Forces re-render when switching modes
                    validationSchema={schema} 
                    onSubmit={handleFormSubmit}
                >
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <JumboInput fieldName="title" label="Category Title" defaultValue={editData?.title || ""} fullWidth />
                        <JumboInput 
                            fieldName="description" 
                            label="Description" 
                            defaultValue={editData?.description || ""}
                            multiline 
                            rows={3} 
                            fullWidth 
                        />
                        
                        <Div>
                            {/* Show current image if editing */}
                            {editData?.image && !imageFile && (
                                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar src={editData.image} variant="rounded" sx={{ width: 50, height: 50 }} />
                                    <Typography variant="caption">Current Image</Typography>
                                </Box>
                            )}
                            
                            <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5 }}>
                                {imageFile ? `New: ${imageFile.name}` : editData ? "Change Image" : "Choose Category Image"}
                                <input 
                                    type="file" 
                                    hidden 
                                    accept="image/*" 
                                    onChange={(e) => setImageFile(e.target.files[0])} 
                                />
                            </Button>
                        </Div>

                        <LoadingButton 
                            loading={loading} 
                            type="submit" 
                            variant="contained" 
                            size="large"
                            fullWidth
                        >
                            {editData ? "Update Category" : "Save Category"}
                        </LoadingButton>
                    </Stack>
                </JumboForm>
            </DialogContent>
        </Dialog>
    );
};

export default CategoryDialog;