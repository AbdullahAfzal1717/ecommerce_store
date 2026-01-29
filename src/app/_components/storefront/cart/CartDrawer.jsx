import React from 'react';
import { Drawer, Box, Typography, IconButton, List, Divider, Button, Stack } from '@mui/material';
import { Close, DeleteOutline, Add, Remove } from '@mui/icons-material';
import { useCart } from "@app/_components/_core/CartProvider/hooks";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({ open, onClose }) => {
    const { cartItems, total, updateQuantity, removeItem } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate("/checkout");
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: { xs: '100vw', sm: 400 }, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" fontWeight="bold">My Cart</Typography>
                    <IconButton onClick={onClose}><Close /></IconButton>
                </Stack>
                <Divider />

                <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
                    {cartItems.length === 0 ? (
                        <Typography variant="body1" textAlign="center" mt={10} color="text.secondary">
                            Your cart is empty
                        </Typography>
                    ) : (
                        cartItems.map((item) => (
                            <Box key={item._id} sx={{ mb: 3 }}>
                                <Stack direction="row" spacing={2}>
                                    <img 
                                        src={item.images?.[0]} 
                                        style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} 
                                    />
                                    <Box flexGrow={1}>
                                        <Typography variant="h6" noWrap sx={{ maxWidth: 150 }}>{item.title}</Typography>
                                        <Typography variant="body2" color="primary" fontWeight="bold">
                                            ${(item.price * item.quantityInCart).toFixed(2)}
                                        </Typography>
                                        
                                        <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                                            <IconButton size="small" onClick={() => updateQuantity(item._id, -1, item.quantity)}>
                                                <Remove fontSize="small" />
                                            </IconButton>
                                            <Typography>{item.quantityInCart}</Typography>
                                            <IconButton size="small" onClick={() => updateQuantity(item._id, 1, item.quantity)}>
                                                <Add fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </Box>
                                    <IconButton color="error" onClick={() => removeItem(item._id)}>
                                        <DeleteOutline />
                                    </IconButton>
                                </Stack>
                            </Box>
                        ))
                    )}
                </Box>

                <Divider />
                <Box sx={{ pt: 3 }}>
                    <Stack direction="row" justifyContent="space-between" mb={3}>
                        <Typography variant="h5">Total:</Typography>
                        <Typography variant="h5" fontWeight="bold">${total.toFixed(2)}</Typography>
                    </Stack>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        size="large" 
                        disabled={cartItems.length === 0}
                        onClick={handleCheckout}
                    >
                        Proceed to Checkout
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default CartDrawer;