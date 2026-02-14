import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  InputAdornment,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Save, Percent, Casino } from "@mui/icons-material";
import { toast } from "@app/_components/_core/MessageProvider";
import { settingsService } from "@app/_services/settings.category";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

const SettingsPage = () => {
  const { revalidate } = useAuth();
  const [settings, setSettings] = useState({
    cashbackPercentage: 10,
    winModeEnabled: false,
    referralBonusEnabled: true,
  });
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  // 1. Fetch settings from DB on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsService.getGlobalSettings();
        console.log(response)
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        toast.error("Failed to load settings from server");
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  // 2. Handle Save
  const handleSave = async () => {
    setLoading(true);
    try {
      await settingsService.updateGlobalSettings(settings, revalidate);
      toast.success("Global settings updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" fontWeight="800" mb={4}>
        System Settings
      </Typography>

      <Grid container spacing={4}>
        {/* REWARDS CONFIGURATION */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" mb={3}>
              <Percent color="primary" />
              <Typography variant="h5" fontWeight="700">
                Earnings & Rewards
              </Typography>
            </Stack>

            <TextField
              fullWidth
              label="Referrer Bonus Percentage"
              type="number"
              value={settings.cashbackPercentage}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  cashbackPercentage: Number(e.target.value),
                })
              }
              helperText="Percentage of order total given to the referrer"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              sx={{ mb: 3 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.referralBonusEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      referralBonusEnabled: e.target.checked,
                    })
                  }
                />
              }
              label="Enable Referral Bonus System"
            />
          </Paper>
        </Grid>

        {/* LUCKY SPIN CONFIGURATION */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" mb={3}>
              <Casino color="secondary" />
              <Typography variant="h5" fontWeight="700">
                Lucky Spin (Win Mode)
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" mb={2}>
              <b>Win Mode</b> increases probability of users winning higher
              rewards. Ideal for marketing events.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  color="secondary"
                  checked={settings.winModeEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      winModeEnabled: e.target.checked,
                    })
                  }
                />
              }
              label={
                settings.winModeEnabled
                  ? "WIN MODE: ACTIVE"
                  : "WIN MODE: NORMAL"
              }
            />

            {settings.winModeEnabled && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "secondary.lighter",
                  borderRadius: 2,
                  border: "1px dashed",
                  borderColor: "secondary.main",
                }}
              >
                <Typography
                  variant="caption"
                  color="secondary.main"
                  fontWeight="bold"
                >
                  Winning algorithms are now favoring the user.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          size="large"
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : <Save />
          }
          onClick={handleSave}
          disabled={loading}
          sx={{ px: 6, py: 1.5, borderRadius: 3, fontWeight: "bold" }}
        >
          {loading ? "Saving..." : "Save Global Settings"}
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
