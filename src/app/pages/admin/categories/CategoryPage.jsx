import React, { useEffect, useState } from 'react';
import { Typography, Button, Stack, Card, CardContent, CircularProgress } from '@mui/material';
import { Div } from "@jumbo/shared";
import AddIcon from '@mui/icons-material/Add';
import { categoryService } from "@app/_services/category.service";
import CategoryTable from "@app/_components/admin/categories/CategoryTable";
import CategoryDialog from "@app/_components/admin/categories/CategoryDialog";

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [fetchingDetail, setFetchingDetail] = useState(false); // New: loading state for fetch-by-id

    const fetchCategories = async () => {
        try {
            const res = await categoryService.getAll();
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // IMPROVED: Fetch fresh data by ID before opening dialog
    const handleEdit = async (categoryRow) => {
        setFetchingDetail(true);
        try {
            const res = await categoryService.getById(categoryRow._id);
            setSelectedCategory(res.data); // Set fresh data from backend
            setOpenDialog(true);
        } catch (error) {
            console.error("Error fetching category detail", error);
            alert("Could not fetch latest details");
        } finally {
            setFetchingDetail(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await categoryService.delete(id);
                fetchCategories();
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    return (
        <Div sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h2">Categories</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    {fetchingDetail && <CircularProgress size={24} />}
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={() => { setSelectedCategory(null); setOpenDialog(true); }}
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
                        onDelete={handleDelete} 
                    />
                </CardContent>
            </Card>

            <CategoryDialog 
                open={openDialog} 
                onClose={() => {
                    setOpenDialog(false);
                    setSelectedCategory(null); // Clear on close
                }} 
                refresh={fetchCategories}
                editData={selectedCategory}
            />
        </Div>
    );
};

export default CategoryPage;