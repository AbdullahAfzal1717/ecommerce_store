import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Container,
  Dialog,
  DialogContent,
  DialogActions,
  Zoom,
} from "@mui/material";
import { Wheel } from "react-custom-roulette";
import { Casino, Celebration, EmojiEvents } from "@mui/icons-material";

// Hooks & Services
import { spinService } from "@app/_services/spin.service";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { toast } from "@app/_components/_core/MessageProvider";

const wheelData = [
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
    option: "Rs. 500",
    style: { backgroundColor: "#ffc107", textColor: "#000" },
  },
  {
    option: "Rs. 10",
    style: { backgroundColor: "#1976d2", textColor: "#fff" },
  },
];

const StatCard = ({ label, value, color = "text.primary" }) => (
  <Box>
    <Typography
      variant="caption"
      display="block"
      color="text.secondary"
      fontWeight="500"
    >
      {label}
    </Typography>
    <Typography variant="h4" fontWeight="bold" color={color}>
      {value}
    </Typography>
  </Box>
);

const LuckySpinPage = () => {
  const { authUser, revalidate } = useAuth();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [winData, setWinData] = useState(null); // State for the Popup

  const handleSpinClick = async () => {
    if (authUser?.availableSpins < 1) {
      toast.error("You don't have any spins left!");
      return;
    }
    setLoading(true);

    try {
      // SOLUTION 2: Pass revalidate here. It refreshes user data in background.
      const result = await spinService.executeSpin(revalidate);
      console.log("result", result);

      const prizeIndex = wheelData.findIndex((item) =>
        item.option.includes(result.data.prize.split(" ")[1])
      );
      console.log("prizeIndex", prizeIndex);

      const finalIndex = prizeIndex === -1 ? 2 : prizeIndex;
      console.log("finalIndex", finalIndex);
      setPrizeNumber(finalIndex);
      console.log("prize number", prizeNumber);
      setWinData(result.data); // Store winning info for the popup
      setMustSpin(true);
    } catch (error) {
      toast.error(error.message || "Spin failed");
      setLoading(false);
    }
  };

  const onStopSpinning = () => {
    setMustSpin(false);
    setLoading(false);
    // The Popup will be shown because winData is set
  };

  const closePopup = () => setWinData(null);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: "center" }}>
        <Typography variant="h2" fontWeight="900" color="primary" gutterBottom>
          LUCKY SPIN
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Reach <b>Green Status</b> to earn spins! Win rewards instantly.
        </Typography>

        {/* REUSABLE STATS SECTION */}
        <Stack direction="row" justifyContent="center" spacing={8} mb={4}>
          <StatCard
            label="AVAILABLE SPINS"
            value={authUser?.availableSpins || 0}
            color="secondary.main"
          />
        </Stack>

        {/* WHEEL SECTION */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={wheelData}
            onStopSpinning={onStopSpinning}
            outerBorderColor="#eeeeee"
            outerBorderWidth={10}
            innerRadius={20}
            textDistance={60}
          />
          <Box
            sx={{
              position: "absolute",
              top: -25,
              zIndex: 10,
              fontSize: "40px",
            }}
          >
            👇
          </Box>
        </Box>

        <Button
          variant="contained"
          size="large"
          disabled={mustSpin || loading || authUser?.availableSpins < 1}
          onClick={handleSpinClick}
          startIcon={<Casino />}
          sx={{
            px: 10,
            py: 2,
            borderRadius: 10,
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        >
          {loading ? "Calculating..." : "SPIN NOW"}
        </Button>
      </Paper>

      {/* WIN POPUP (Dialog) */}
      <Dialog
        open={!!winData && !mustSpin}
        TransitionComponent={Zoom}
        onClose={closePopup}
        PaperProps={{ sx: { borderRadius: 5, p: 2, textAlign: "center" } }}
      >
        <DialogContent>
          <EmojiEvents sx={{ fontSize: 80, color: "#ffc107", mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {winData?.amountWon > 0 ? "Congratulations!" : "Ouch!"}
          </Typography>
          <Typography variant="h6">
            {winData?.amountWon > 0
              ? `You just won Rs. ${winData.amountWon}!`
              : "Better luck next time!"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            New Wallet Balance: Rs. {authUser?.walletBalance}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={closePopup}
            variant="contained"
            sx={{ borderRadius: 3, px: 4 }}
          >
            Awesome!
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LuckySpinPage;
