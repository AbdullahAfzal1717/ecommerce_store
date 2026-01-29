import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Stack, Avatar,Typography,IconButton, Button, Box } from "@mui/material";
import { JumboForm, JumboInput } from "@jumbo/vendors/react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { userService } from "@app/_services/user.service";
import * as yup from "yup";

const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
});

const EditProfileDialog = ({ open, onClose }) => {
    const { authUser, updateAuthUser } = useAuth(); // Assume you'll add updateAuthUser to Context
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview] = useState(authUser?.avatar || "");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = async (data) => {
        setLoading(true);
        try {
            const result = await userService.updateProfile({ ...data, avatar: avatarFile });
            // Update the global auth state with new data from server
            updateAuthUser(result.data.user); 
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle><Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h3" mb={0}>
                   EditProfile</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Stack></DialogTitle>
            <DialogContent dividers>
                <JumboForm 
                    validationSchema={schema} 
                    onSubmit={handleFormSubmit}
                    onChange={()=>{}}
                >
                    <Stack spacing={3} alignItems="center">
                        <Box sx={{ position: 'relative' }}>
                            <Avatar key={preview} src={preview} sx={{ width: 100, height: 100, mb: 1 }} />
                            <Button variant="text" component="label" size="small" fullWidth>
                                Change Photo
                                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                            </Button>
                        </Box>
                        <JumboInput fieldName="username" label="Username" defaultValue={authUser?.username} fullWidth />
                        <JumboInput fieldName="email" label="Email Address" defaultValue={authUser?.email} disabled sx={{ 
        bgcolor: 'action.hover', // Subtle grey background
        "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#666", // Makes text readable but clearly locked
        }
    }} fullWidth />
                        <LoadingButton loading={loading} type="submit" variant="contained" fullWidth>
                            Save Changes
                        </LoadingButton>
                    </Stack>
                </JumboForm>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfileDialog;