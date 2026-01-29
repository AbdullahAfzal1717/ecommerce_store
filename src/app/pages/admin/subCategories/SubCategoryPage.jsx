import React, { useEffect, useState } from 'react';
import { Typography, Button, Stack, Card, CardContent, CircularProgress } from '@mui/material';
import { Div } from "@jumbo/shared";
import AddIcon from '@mui/icons-material/Add';
import { subcategoryService } from "@app/_services/subcategory.service";
import SubCategoryTable from "@app/_components/admin/subCategories/SubCategoryTable";
import SubCategoryDialog from "@app/_components/admin/subCategories/SubCategoryDialog";

const SubCategoryPage = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        const res = await subcategoryService.getAll();
        setData(res.data);
    };

    useEffect(() => { loadData(); }, []);

    const handleEdit = async (row) => {
        setLoading(true);
        const res = await subcategoryService.getById(row._id);
        setSelected(res.data);
        setOpen(true);
        setLoading(false);
    };

    return (
        <Div sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" mb={4}>
                <Typography variant="h2">Subcategories</Typography>
                <Stack direction="row" spacing={2}>
                    {loading && <CircularProgress size={24} />}
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setSelected(null); setOpen(true); }}>Add New</Button>
                </Stack>
            </Stack>
            <Card><CardContent>
                <SubCategoryTable subcategories={data} onEdit={handleEdit} onDelete={async (id) => { if(window.confirm("Delete?")) { await subcategoryService.delete(id); loadData(); }}} />
            </CardContent></Card>
            <SubCategoryDialog open={open} onClose={() => setOpen(false)} refresh={loadData} editData={selected} />
        </Div>
    );
};

export default SubCategoryPage;