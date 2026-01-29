import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, IconButton, Menu, MenuItem, Chip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const SubCategoryTable = ({ subcategories, onEdit, onDelete }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedRow, setSelectedRow] = React.useState(null);

    const handleMenuOpen = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Parent Category</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {subcategories?.map((sub) => (
                        <TableRow key={sub._id} hover>
                            <TableCell><Avatar src={sub.image} variant="rounded" /></TableCell>
                            <TableCell>{sub.title}</TableCell>
                            <TableCell>{sub.description}</TableCell>
                            <TableCell>
                                <Chip label={sub.category?.title || "N/A"} color="primary" variant="outlined" size="small" />
                            </TableCell>
                            
                            <TableCell align="right">
                                <IconButton onClick={(e) => handleMenuOpen(e, sub)}>
                                    <MoreVertIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} disableScrollLock>
                <MenuItem onClick={() => { onEdit(selectedRow); handleMenuClose(); }}>Edit</MenuItem>
                <MenuItem onClick={() => { onDelete(selectedRow._id); handleMenuClose(); }} sx={{ color: 'error.main' }}>Delete</MenuItem>
            </Menu>
        </TableContainer>
    );
};

export default SubCategoryTable;