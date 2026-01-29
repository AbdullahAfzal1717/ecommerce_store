import React from "react";
import { Avatar, Box, Button, IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Visibility, VisibilityOff, PhotoCamera } from "@mui/icons-material";
import { JumboForm, JumboInput, JumboOutlinedInput } from "@jumbo/vendors/react-hook-form";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { validationSchema } from "../validation";

const SignupForm = () => {
  const [values, setValues] = React.useState({ showPassword: false });
  const [avatarFile, setAvatarFile] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState("");
  
  const { loading, signup } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create local preview
    }
  };

  async function handleSignup(data) {
    try {
      // Merge form data with the file state
      const result=await signup({ ...data, avatar: avatarFile });
      if(result){
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  }

  return (
    <JumboForm validationSchema={validationSchema} onSubmit={handleSignup}>
      <Stack spacing={3} mb={3}>
        {/* Avatar Upload Section */}
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Avatar 
            src={previewUrl} 
            sx={{ width: 80, height: 80, border: '2px solid #eee' }}
          />
          <Button 
            variant="text" 
            component="label" 
            startIcon={<PhotoCamera />} 
            size="small"
          >
            Upload Photo
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
        </Box>

        <JumboInput fieldName={"name"} label={"Full Name"} defaultValue="" />
        
        <JumboInput fullWidth fieldName={"email"} label={"Email"} defaultValue="" />

        <JumboOutlinedInput
          fieldName={"password"}
          label={"Password"}
          type={values.showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={() => setValues({ ...values, showPassword: !values.showPassword })}>
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          defaultValue=""
        />

        <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={loading}>
          Create Account
        </LoadingButton>
      </Stack>
    </JumboForm>
  );
};

export { SignupForm };