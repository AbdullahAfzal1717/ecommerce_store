import React, { useEffect, useState } from 'react';
import { Typography, Button, Stack, Card, CardContent, CircularProgress } from '@mui/material';
import { Div } from "@jumbo/shared";
import AddIcon from '@mui/icons-material/Add';
import { productService } from "@app/_services/product.service";
import ProductTable from "@app/_components/admin/products/ProductTable";
import ProductDialog from "@app/_components/admin/products/ProductDialog";
import ProductDetailsDrawer from "@app/_components/admin/products/ProductDetailsDrawer";

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); // Used for Editing
    const [viewProduct, setViewProduct] = useState(null); // Used for Viewing in Drawer
    const [fetchingDetail, setFetchingDetail] = useState(false);

    const fetchProducts = async () => {
        try {
            const res = await productService.getAll();
            setProducts(res.data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleEdit = async (productRow) => {
        setFetchingDetail(true);
        try {
            const res = await productService.getById(productRow._id);
            setSelectedProduct(res.data);
            setOpenDialog(true);
        } finally { setFetchingDetail(false); }
    };

    return (
        <Div sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" mb={4}>
                <Typography variant="h2">Inventory Management</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    {fetchingDetail && <CircularProgress size={24} />}
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setSelectedProduct(null); setOpenDialog(true); }}>
                        Add New Product
                    </Button>
                </Stack>
            </Stack>

            <Card>
                <CardContent>
                    <ProductTable 
                        products={products} 
                        onEdit={handleEdit} 
                        onDelete={async (id) => { if(window.confirm("Delete?")) { await productService.delete(id); fetchProducts(); }}} 
                        onViewDetail={(prod) => setViewProduct(prod)} // Opens the Drawer
                    />
                </CardContent>
            </Card>

            {/* Dialog for Creating/Editing */}
            <ProductDialog 
                open={openDialog} 
                onClose={() => { setOpenDialog(false); setSelectedProduct(null); }} 
                refresh={fetchProducts}
                editData={selectedProduct}
            />

            {/* Side Drawer for Viewing Gallery/Details */}
            <ProductDetailsDrawer 
                open={Boolean(viewProduct)} 
                product={viewProduct} 
                onClose={() => setViewProduct(null)} 
            />  
        </Div>
    );
};

export default ProductPage;