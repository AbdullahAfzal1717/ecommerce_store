import React from "react";
import { 
    Alert, 
    IconButton, 
    InputAdornment, 
    Stack, 
    Typography, 
    Collapse 
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { 
    JumboForm, 
    JumboInput, 
    JumboOutlinedInput, 
    JumboCheckbox 
} from "@jumbo/vendors/react-hook-form";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "@jumbo/shared";
import { validationSchema } from "../validation";

const LoginForm = () => {
    const { t } = useTranslation();
    const { loading, login } = useAuth();
    const navigate = useNavigate();

    // 1. State for Backend Error Messages
    const [errorMsg, setErrorMsg] = React.useState("");
    const [values, setValues] = React.useState({
        showPassword: false,
    });

    const handleLogin = async (data) => {
        // Clear previous errors before a new attempt
        setErrorMsg(""); 
        
        try {
            await login(data);
            // If login is successful, redirect to dashboard
            navigate("/");
        } catch (error) {
            // 2. Catch the error thrown by AuthProvider and display it
            setErrorMsg(error.message || "Invalid email or password");
        }
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    return (
        <JumboForm 
            validationSchema={validationSchema} 
            onSubmit={handleLogin}
        >
            <Stack spacing={3} mb={3}>
                
                {/* 3. Server-Side Error Alert */}
                <Collapse in={!!errorMsg}>
                    <Alert 
                        severity="error" 
                        variant="filled" 
                        onClose={() => setErrorMsg("")}
                        sx={{ mb: 2 }}
                    >
                        {errorMsg}
                    </Alert>
                </Collapse>

                <JumboInput
                    fullWidth
                    fieldName={"email"}
                    label={t("login.email")}
                    defaultValue="demo@example.com"
                />

                <JumboOutlinedInput
                    fieldName={"password"}
                    label={t("login.password")}
                    type={values.showPassword ? "text" : "password"}
                    margin="none"
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                            >
                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    sx={{ bgcolor: (theme) => theme.palette.background.paper }}
                    defaultValue={"zab#723"}
                />

                <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <JumboCheckbox
                        fieldName="rememberMe"
                        label={t("login.rememberMe")}
                        defaultChecked
                    />
                    <Typography textAlign={"right"} variant={"body1"}>
                        <Link underline="none" to={"/auth/forgot-password"}>
                            {t("login.forgotPassword")}
                        </Link>
                    </Typography>
                </Stack>

                <LoadingButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={loading}
                >
                    {t("login.loggedIn")}
                </LoadingButton>
            </Stack>
        </JumboForm>
    );
};

export { LoginForm };