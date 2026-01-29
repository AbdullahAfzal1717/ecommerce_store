import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const CartTable = ({ cartItems, updateQuantity, removeItem }) => (
  <TableContainer component={Box}>
    <Table sx={{ minWidth: 600 }}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
            Product
          </TableCell>
          <TableCell
            align="center"
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
          >
            Price
          </TableCell>
          <TableCell
            align="center"
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
          >
            Quantity
          </TableCell>
          <TableCell
            align="right"
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
          >
            Total
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {cartItems.map((item) => (
          <TableRow
            key={item._id}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  component="img"
                  src={item.images?.[0]}
                  sx={{
                    width: 80,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="700">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Color : Default
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeItem(item._id)}
                    sx={{
                      p: 0,
                      mt: 1,
                      textTransform: "none",
                      minWidth: "auto",
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              </Stack>
            </TableCell>
            <TableCell align="center">
              <Typography variant="subtitle1" fontWeight="600">
                ${item.price.toFixed(2)}
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  width: "fit-content",
                  mx: "auto",
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => updateQuantity(item._id, -1, item.quantity)}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <Typography sx={{ px: 1, fontWeight: "bold" }}>
                  {item.quantityInCart.toString().padStart(2, "0")}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => updateQuantity(item._id, 1, item.quantity)}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Stack>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle1" fontWeight="700">
                ${(item.price * item.quantityInCart).toFixed(2)}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default CartTable;
