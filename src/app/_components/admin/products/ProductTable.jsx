import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, IconButton, Menu, MenuItem, Chip, Typography, Stack, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ProductTable = ({ products, onEdit, onDelete, onViewDetail }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedRow, setSelectedRow] = React.useState(null);

    const handleMenuOpen = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Gallery</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Category/Sub</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products?.map((prod) => (
                        <TableRow key={prod._id} hover>
                            <TableCell onClick={() => onViewDetail(prod)} sx={{ cursor: 'pointer' }}>
                                <Stack direction="row" spacing={-1.5}>
                                    {prod.images?.slice(0, 3).map((img, index) => (
                                        <Avatar 
                                            key={index}
                                            src={img} 
                                            variant="rounded" 
                                            sx={{ width: 40, height: 40, border: '2px solid white', boxShadow: 2, zIndex: 5 - index }} 
                                        />
                                    ))}
                                    {prod.images?.length > 3 && (
                                        <Avatar variant="rounded" sx={{ width: 40, height: 40, fontSize: 12, bgcolor: 'grey.300', zIndex: 0 }}>
                                            +{prod.images.length - 3}
                                        </Avatar>
                                    )}
                                </Stack>
                            </TableCell>
                            <TableCell onClick={() => onViewDetail(prod)} sx={{ cursor: 'pointer' }}>
                                <Typography variant="body1" fontWeight="500" sx={{ '&:hover': { color: 'primary.main' } }}>
                                    {prod.title}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="caption" display="block">{prod.subCategory?.category?.title}</Typography>
                                <Chip label={prod.subCategory?.title} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>Rs. {prod.price}</TableCell>
                            <TableCell>{prod.quantity}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={(e) => handleMenuOpen(e, prod)}><MoreVertIcon /></IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => { onEdit(selectedRow); setAnchorEl(null); }}>Edit</MenuItem>
                <MenuItem onClick={() => { onDelete(selectedRow._id); setAnchorEl(null); }} sx={{ color: 'error.main' }}>Delete</MenuItem>
            </Menu>
        </TableContainer>
    );
};

export default ProductTable;