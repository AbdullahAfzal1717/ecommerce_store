import React from "react";
import { Card, CardContent, Typography, Stack, Divider } from "@mui/material";
import { AccountBalanceWallet, Stars } from "@mui/icons-material";
import DetailRow from "./DetailRow";
import AdminConsoleCard from "./AdminConsoleCard";

const ProfileDetails = ({ user }) => {
  return (
    <Card sx={{ borderRadius: 6, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="800" mb={3}>
          Information Overview
        </Typography>

        <Stack spacing={2.5}>
          <DetailRow label="Email Address" value={user?.email} />
          <DetailRow label="Account ID" value={user?.id} isCode />

          <Divider />

          <Typography
            variant="subtitle2"
            color="text.secondary"
            fontWeight="700"
          >
            REWARDS & REFERRALS
          </Typography>

          <DetailRow
            label="Wallet Balance"
            value={`Rs. ${user?.walletBalance || 0}`}
            icon={
              <AccountBalanceWallet
                sx={{ fontSize: 18, mr: 1, color: "success.main" }}
              />
            }
          />
          <DetailRow
            label="Available Spins"
            value={user?.availableSpins || 0}
            icon={<Stars sx={{ fontSize: 18, mr: 1, color: "warning.main" }} />}
          />
          <DetailRow
            label="Referral Code"
            value={user?.referralCode}
            copyable
            isCode
          />

          {user?.role === "admin" && (
            <>
              <Divider sx={{ my: 1 }} />
              <AdminConsoleCard />
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
