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
import { usePagination } from "@app/_hooks/usePagination";
import { downloadCSV } from "@app/_utilities/helpers/exportCSV";
import { toast } from "@app/_components/_core/MessageProvider"; // Import toast

const SubCategoryTable = ({ subcategories = [], onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const {
    page,
    rowsPerPage,
    paginatedItems,
    handleChangePage,
    handleChangeRowsPerPage,
    totalCount,
  } = usePagination(subcategories, 5);

  const handleExport = () => {
    toast.info("Generating subcategory report..."); // Feedback
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
      sub.description?.replace(/,/g, " ") || "No Description",
    ]);
    downloadCSV(data, headers, "subcategories_list");
    toast.success("Download started");
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
