import React, { useState } from 'react';
import { Card, CardContent, Avatar, Typography, Stack, Button, Divider,Box } from '@mui/material';
import { Div } from "@jumbo/shared";
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import EditProfileDialog from "@app/_components/admin/profile/EditProfileDialog";

const ProfilePage = () => {
    const { authUser } = useAuth();
    const [editOpen, setEditOpen] = useState(false);

    return (
        <Div sx={{ p: 4 }}>
            <Typography variant="h2" mb={4}>My Profile</Typography>
            <Card sx={{ maxWidth: 600, mx: 'auto' }}>
                <CardContent>
                    <Stack alignItems="center" spacing={2} mb={4}>
                        <Avatar 
                            src={authUser?.avatar} 
                            sx={{ width: 120, height: 120, border: '4px solid', borderColor: 'primary.main' }}
                        />
                        <Box textAlign="center">
                            <Typography variant="h3">{authUser?.username}</Typography>
                            <Typography color="text.secondary">{authUser?.email}</Typography>
                        </Box>
                        <Button 
                            variant="outlined" 
                            startIcon={<EditIcon />} 
                            onClick={() => setEditOpen(true)}
                        >
                            Edit Profile
                        </Button>
                    </Stack>
                    <Divider />
                    <Stack spacing={2} mt={3}>
                        <Div sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography fontWeight="bold">Account ID:</Typography>
                            <Typography color="text.secondary">{authUser?.id}</Typography>
                        </Div>
                        {/* Add more profile fields here if needed */}
                    </Stack>
                </CardContent>
            </Card>
            <EditProfileDialog open={editOpen} onClose={() => setEditOpen(false)} />
        </Div>
    );
};

export default ProfilePage;