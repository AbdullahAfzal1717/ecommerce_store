import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
  Stack,
  Typography,
  Button,
  TablePagination,
  Paper,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

// Import your utilities
import { usePagination } from "@app/_hooks/usePagination";
import { downloadCSV } from "@app/_utilities/helpers/exportCSV";

const SubCategoryTable = ({ subcategories = [], onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);

  // 1. INTEGRATE PAGINATION HOOK
  const {
    page,
    rowsPerPage,
    paginatedItems,
    handleChangePage,
    handleChangeRowsPerPage,
    totalCount,
  } = usePagination(subcategories, 5);

  // 2. INTEGRATE CSV EXPORT
  const handleExport = () => {
    const headers = [
      "ID",
      "Sub-Category Title",
      "Parent Category",
      "Description",
    ];
    const data = subcategories.map((sub) => [
      sub._id,
      sub.title,
      sub.category?.title || "N/A",
      sub.description?.replace(/,/g, " ") || "No Description", // Prevent CSV column breaks
    ]);
    downloadCSV(data, headers, "subcategories_list");
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  return (
    <Box>
      {/* Header with Export Action */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="700">
          Sub-Category Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Export CSV
        </Button>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Parent Category</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* 3. MAP OVER paginatedItems */}
            {paginatedItems.map((sub) => (
              <TableRow key={sub._id} hover>
                <TableCell>
                  <Avatar
                    src={sub.image}
                    variant="rounded"
                    sx={{ width: 40, height: 40 }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{sub.title}</TableCell>
                <TableCell
                  sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                >
                  {sub.description}
                </TableCell>
                <TableCell>
                  <Chip
                    label={sub.category?.title || "N/A"}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ fontWeight: "500" }}
                  />
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

        {/* 4. PAGINATION CONTROLS */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        disableScrollLock
      >
        <MenuItem
          onClick={() => {
            onEdit(selectedRow);
            handleMenuClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete(selectedRow._id);
            handleMenuClose();
          }}
          sx={{ color: "error.main" }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SubCategoryTable;
