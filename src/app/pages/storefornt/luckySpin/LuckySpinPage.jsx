import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Container,
} from "@mui/material";
import { Wheel } from "react-custom-roulette";
import { spinService } from "@app/_services/spin.service";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { toast } from "@app/_components/_core/MessageProvider";
import { Casino, AccountBalanceWallet } from "@mui/icons-material";

const data = [
  { option: "Rs. 5", style: { backgroundColor: "#f8f9fa", textColor: "#333" } },
  {
    option: "Rs. 20",
    style: { backgroundColor: "#1976d2", textColor: "#fff" },
  },
  {
    option: "TRY AGAIN",
    style: { backgroundColor: "#333", textColor: "#fff" },
  },
  {
    option: "Rs. 50",
    style: { backgroundColor: "#f8f9fa", textColor: "#333" },
  },
  {
    option: "JACKPOT",
    style: { backgroundColor: "#ffc107", textColor: "#000" },
  },
  {
    option: "Rs. 10",
    style: { backgroundColor: "#1976d2", textColor: "#fff" },
  },
];

const LuckySpinPage = () => {
  const { authUser, updateAuthUser } = useAuth(); // Assuming updateAuthUser refreshes the local state
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSpinClick = async () => {
    if (authUser.availableSpins < 1) {
      toast.error("You don't have any spins left!");
      return;
    }

    setLoading(true);
    try {
      const result = await spinService.executeSpin();

      // Find the index in our 'data' array that matches the backend prize string
      // e.g., if backend returns "Rs. 5", we find index 0
      const prizeIndex = data.findIndex((item) =>
        item.option.includes(result.data.prize.split(" ")[0])
      );
      const finalIndex = prizeIndex === -1 ? 2 : prizeIndex; // fallback to 'Try Again'

      setPrizeNumber(finalIndex);
      setMustSpin(true);
    } catch (error) {
      toast.error(error.message || "Spin failed");
    } finally {
      setLoading(false);
    }
  };

  const onStopSpinning = () => {
    setMustSpin(false);
    setLoading(false);
    toast.success("Spin complete!");
    // Refresh user data (spins and wallet balance) in the global context
    // updateAuthUser();
  };

  return (
    <Container maxWidth="md" sx={{ py: 5, textAlign: "center" }}>
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 4, bgcolor: "background.paper" }}
      >
        <Stack alignItems="center" spacing={3}>
          <Typography variant="h2" fontWeight="900" color="primary">
            LUCKY SPIN
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Reach <b>Green Status</b> to earn spins! Win up to Rs. 500
            instantly.
          </Typography>

          <Stack direction="row" spacing={4} sx={{ my: 2 }}>
            <Box>
              <Typography variant="caption" display="block">
                AVAILABLE SPINS
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="secondary">
                {authUser?.availableSpins || 0}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" display="block">
                WALLET BALANCE
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                Rs. {authUser?.walletBalance || 0}
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ position: "relative", my: 4 }}>
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}
              onStopSpinning={onStopSpinning}
              outerBorderColor="#eeeeee"
              outerBorderWidth={10}
              innerRadius={20}
              innerBorderColor="#ffffff"
              radiusLineColor="#eeeeee"
              radiusLineWidth={1}
              textDistance={60}
            />
          </Box>
          {/* The Pointer */}
          <Box
            sx={{
              position: "absolute",
              top: -20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              fontSize: "40px",
            }}
          >
            👇
          </Box>
        </Stack>
        <Stack>
          <Button
            variant="contained"
            size="large"
            disabled={mustSpin || loading || authUser?.availableSpins < 1}
            onClick={handleSpinClick}
            startIcon={<Casino />}
            sx={{
              px: 8,
              py: 2,
              borderRadius: 10,
              fontSize: "1.2rem",
              fontWeight: "bold",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }}
          >
            {loading ? "Calculating..." : "SPIN NOW"}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default LuckySpinPage;
