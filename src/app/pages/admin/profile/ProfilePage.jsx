import React, { useState } from "react";
import { Typography, Grid } from "@mui/material";
import { Div } from "@jumbo/shared";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import EditProfileDialog from "@app/_components/admin/profile/EditProfileDialog";
import ProfileHeader from "@app/_components/admin/profile/ProfileHeader";
import ProfileDetails from "@app/_components/admin/profile/ProfileDetails";

const ProfilePage = () => {
  const { authUser } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Div sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h2" mb={4} fontWeight="800">
        Account Settings
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <ProfileHeader user={authUser} onEdit={() => setEditOpen(true)} />
        </Grid>

        <Grid item xs={12} md={7}>
          <ProfileDetails user={authUser} />
        </Grid>
      </Grid>

      <EditProfileDialog open={editOpen} onClose={() => setEditOpen(false)} />
    </Div>
  );
};

export default ProfilePage;
