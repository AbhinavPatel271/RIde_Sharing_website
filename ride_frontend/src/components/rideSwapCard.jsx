import React, { useState } from "react";
import {
  Typography,
  TextField,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";

const RideSwapCard = ({ initialSource, initialDestination }) => {
  const [source, setSource] = useState(initialSource);
  const [destination, setDestination] = useState(initialDestination);

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
  };

  return (
    <div
      className="popular-ride-card"
      style={{
        minWidth: "350px",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        opacity: "0.75",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
        Popular Rides
      </Typography>

      <TextField
        label="Source"
        value={source}
        fullWidth
        readOnly
        sx={{ mb: 2 }}
      />

      <div style={{ textAlign: "center", margin: "-15px 0 -5px 0" }}>
        <SwapVertIcon onClick={handleSwap} />
      </div>

      <TextField label="Destination" value={destination} fullWidth readOnly />
    </div>
  );
};

export default RideSwapCard;
