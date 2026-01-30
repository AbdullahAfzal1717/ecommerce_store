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
  Typography,
  Stack,
  Box,
  Paper,
  Button,
  TablePagination,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

// Import your utilities
import { usePagination } from "@app/_hooks/usePagination";
import { downloadCSV } from "@app/_utilities/helpers/exportCSV";

const ProductTable = ({ products = [], onEdit, onDelete, onViewDetail }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);

  // 1. INTEGRATE PAGINATION HOOK (Default to 10 products per page)
  const {
    page,
    rowsPerPage,
    paginatedItems,
    handleChangePage,
    handleChangeRowsPerPage,
    totalCount,
  } = usePagination(products, 10);

  // 2. INTEGRATE CSV EXPORT
  const handleExport = () => {
    const headers = [
      "ID",
      "Title",
      "Category",
      "Sub-Category",
      "Price",
      "Quantity",
    ];
    const data = products.map((prod) => [
      prod._id,
      prod.title.replace(/,/g, ""), // Remove commas to prevent CSV breakage
      prod.subCategory?.category?.title || "N/A",
      prod.subCategory?.title || "N/A",
      prod.price,
      prod.quantity,
    ]);
    downloadCSV(data, headers, "products_inventory");
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
          Product Inventory
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Export Inventory
        </Button>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Gallery</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Category/Sub</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Qty</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* 3. MAP OVER paginatedItems */}
            {paginatedItems.map((prod) => (
              <TableRow key={prod._id} hover>
                <TableCell
                  onClick={() => onViewDetail(prod)}
                  sx={{ cursor: "pointer" }}
                >
                  <Stack direction="row" spacing={-1.5}>
                    {prod.images?.slice(0, 3).map((img, index) => (
                      <Avatar
                        key={index}
                        src={img}
                        variant="rounded"
                        sx={{
                          width: 40,
                          height: 40,
                          border: "2px solid white",
                          boxShadow: 2,
                          zIndex: 5 - index,
                        }}
                      />
                    ))}
                    {prod.images?.length > 3 && (
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 40,
                          height: 40,
                          fontSize: 12,
                          bgcolor: "grey.300",
                          zIndex: 0,
                        }}
                      >
                        +{prod.images.length - 3}
                      </Avatar>
                    )}
                  </Stack>
                </TableCell>
                <TableCell
                  onClick={() => onViewDetail(prod)}
                  sx={{ cursor: "pointer" }}
                >
                  <Typography
                    variant="body1"
                    fontWeight="600"
                    sx={{ "&:hover": { color: "primary.main" } }}
                  >
                    {prod.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    {prod.subCategory?.category?.title}
                  </Typography>
                  <Chip
                    label={prod.subCategory?.title}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: "700" }}>
                  Rs. {prod.price}
                </TableCell>
                <TableCell>
                  <Typography
                    color={prod.quantity < 5 ? "error.main" : "text.primary"}
                    fontWeight="500"
                  >
                    {prod.quantity}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleMenuOpen(e, prod)}>
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

export default ProductTable;
