import React from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Avatar, IconButton, Menu, MenuItem 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const CategoryTable = ({ categories, onEdit, onDelete }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    // Renamed to 'selectedRow' for clarity, as it holds the whole category object
    const [selectedRow, setSelectedRow] = React.useState(null);

    const handleMenuOpen = (event, category) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(category);
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
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {categories?.map((cat) => (
                        <TableRow key={cat._id} hover>
                            <TableCell>
                                <Avatar src={cat.image} variant="rounded" sx={{ width: 40, height: 40 }} />
                            </TableCell>
                            <TableCell>{cat.title}</TableCell>
                            <TableCell>{cat.description}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={(e) => handleMenuOpen(e, cat)}>
                                    <MoreVertIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Action Menu */}
            <Menu 
                anchorEl={anchorEl} 
                open={Boolean(anchorEl)} 
                onClose={handleMenuClose}
                disableScrollLock // Professional touch: prevents page jump when opening menu
            >
                <MenuItem onClick={() => { 
                    onEdit(selectedRow); // Passes the category object to fetch fresh data in Page
                    handleMenuClose(); 
                }}>
                    Edit
                </MenuItem>
                <MenuItem onClick={() => { 
                    onDelete(selectedRow._id); 
                    handleMenuClose(); 
                }} sx={{ color: 'error.main' }}>
                    Delete
                </MenuItem>
            </Menu>
        </TableContainer>
    );
};

export default CategoryTable;