import React from 'react';
import { Drawer, Box, Typography, Stack, ImageList, ImageListItem, Divider, IconButton, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ProductDetailsDrawer = ({ open, product, onClose }) => {
    if (!product) return null;

    return (
        <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 450 } } }}>
            <Box sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h3">Product Details</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Stack>

                <Typography variant="h5" color="text.secondary" mb={1}>Gallery</Typography>
                <ImageList cols={2} gap={8} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                    {product.images?.map((item, index) => (
                        <ImageListItem key={index}>
                            <img src={item} alt={`Product ${index}`} loading="lazy" style={{ height: '150px', objectFit: 'cover' }} />
                        </ImageListItem>
                    ))}
                </ImageList>

                <Divider sx={{ my: 3 }} />

                <Stack spacing={3}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Title</Typography>
                        <Typography variant="h4" fontWeight="bold">{product.title}</Typography>
                    </Box>

                    <Stack direction="row" spacing={4}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Price</Typography>
                            <Typography variant="body1" color="primary.main" fontWeight="bold">Rs. {product.price}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Stock Status</Typography>
                            <Typography variant="body1">{product.quantity} units</Typography>
                        </Box>
                    </Stack>

                    <Box>
                        <Typography variant="caption" color="text.secondary">Category Path</Typography>
                        <Stack direction="row" spacing={1} mt={0.5}>
                            <Chip label={product.subCategory?.category?.title} size="small" variant="outlined" />
                            <Typography variant="body2" sx={{ alignSelf: 'center' }}>/</Typography>
                            <Chip label={product.subCategory?.title} size="small" color="primary" />
                        </Stack>
                    </Box>

                    <Box>
                        <Typography variant="caption" color="text.secondary">Full Description</Typography>
                        <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.6, color: 'text.primary' }}>
                            {product.description}
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Drawer>
    );
};

export default ProductDetailsDrawer;