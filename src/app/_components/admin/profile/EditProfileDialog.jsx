import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Avatar,
  Typography,
  IconButton,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { JumboForm, JumboInput } from "@jumbo/vendors/react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { userService } from "@app/_services/user.service";
import { toast } from "@app/_components/_core/MessageProvider";
import * as yup from "yup";

const schema = yup.object().shape({
  username: yup.string().required("Username is required").min(3, "Too short"),
});

const EditProfileDialog = ({ open, onClose }) => {
  const { authUser, updateAuthUser, revalidate } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(authUser?.avatar || "");

  // Update preview if authUser changes while dialog is open
  useEffect(() => {
    if (authUser?.avatar) setPreview(authUser.avatar);
  }, [authUser]);

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
      // Create a clean object for the update
      const updateData = {
        username: data.username,
        avatar: avatarFile, // Pass the file object
      };

      const result = await userService.updateProfile(updateData, revalidate);
      updateAuthUser(result.data.user);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h3" fontWeight="800" mb={0}>
            Edit Profile
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 3 }}>
        <JumboForm validationSchema={schema} onSubmit={handleFormSubmit}>
          <Stack spacing={3} alignItems="center">
            {/* Avatar Section */}
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={preview}
                sx={{
                  width: 100,
                  height: 100,
                  mb: 1,
                  border: "2px solid",
                  borderColor: "primary.main",
                }}
              />
              <IconButton
                color="primary"
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 10,
                  right: 0,
                  bgcolor: "white",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
                size="small"
              >
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Editable Field */}
            <JumboInput
              fieldName="username"
              label="Username"
              defaultValue={authUser?.username}
              fullWidth
            />

            <Divider sx={{ width: "100%", my: 1 }}>
              <Typography variant="caption" color="text.secondary">
                READ-ONLY INFO
              </Typography>
            </Divider>

            {/* Read-Only Status Fields */}
            <Stack direction="row" spacing={2} width="100%">
              <JumboInput
                fieldName="walletBalance"
                label="Wallet"
                defaultValue={`Rs. ${authUser?.walletBalance || 0}`}
                disabled
                fullWidth
                sx={{ bgcolor: "grey.50" }}
              />
              <JumboInput
                fieldName="accountStatus"
                label="Status"
                defaultValue={authUser?.accountStatus?.toUpperCase()}
                disabled
                fullWidth
                sx={{ bgcolor: "grey.50" }}
              />
            </Stack>

            <JumboInput
              fieldName="email"
              label="Email Address"
              defaultValue={authUser?.email}
              disabled
              fullWidth
              sx={{
                bgcolor: "grey.50",
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#888",
                },
              }}
            />

            <LoadingButton
              loading={loading}
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ borderRadius: 3, fontWeight: "bold", py: 1.5 }}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </JumboForm>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
