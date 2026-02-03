import React from "react";
import { SnackbarProvider, enqueueSnackbar, useSnackbar } from "notistack";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const toast = {
  success: (msg) => enqueueSnackbar(msg, { variant: "success" }),
  error: (msg) => enqueueSnackbar(msg, { variant: "error" }),
  info: (msg) => enqueueSnackbar(msg, { variant: "info" }),
  warning: (msg) => enqueueSnackbar(msg, { variant: "warning" }),
};

// Helper component to enable closing snackbars
const CloseButton = ({ snackbarId }) => {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButton
      size="small"
      onClick={() => closeSnackbar(snackbarId)}
      color="inherit"
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
};

export const MessageProvider = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      action={(snackbarId) => <CloseButton snackbarId={snackbarId} />}
    >
      {children}
    </SnackbarProvider>
  );
};
