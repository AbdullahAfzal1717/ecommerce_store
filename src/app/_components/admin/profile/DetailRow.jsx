import React from "react";
import { Typography, Stack, IconButton } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { Div } from "@jumbo/shared";
import { toast } from "@app/_components/_core/MessageProvider";

const DetailRow = ({ label, value, copyable, isCode, icon }) => (
  <Div
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Typography
      color="text.secondary"
      variant="body1"
      sx={{ display: "flex", alignItems: "center" }}
    >
      {label}:
    </Typography>
    <Stack direction="row" spacing={1} alignItems="center">
      {icon}
      <Typography
        fontWeight="700"
        sx={{
          fontFamily: isCode ? "monospace" : "inherit",
          bgcolor: isCode ? "action.hover" : "transparent",
          px: isCode ? 1 : 0,
          borderRadius: 1,
        }}
      >
        {value}
      </Typography>
      {copyable && (
        <IconButton
          size="small"
          onClick={() => {
            navigator.clipboard.writeText(value);
            toast.success(`${label} copied!`);
          }}
        >
          <ContentCopy sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Stack>
  </Div>
);

export default DetailRow;
