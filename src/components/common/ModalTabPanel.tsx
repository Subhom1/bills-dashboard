// src/components/common/Modal.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Bill } from "@/types";
import PropTypes from "prop-types";
interface ModalProps {
  open: boolean;
  onClose: () => void;
  bill: Bill | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bill-tabpanel-${index}`}
      aria-labelledby={`bill-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const ModalTabPanel = ({ open, onClose, bill }: ModalProps) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (!bill) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: "80vh", // Fixed height relative to viewport
          maxHeight: "600px", // Maximum height
          display: "flex",
          flexDirection: "column",
        },
      }}
      aria-labelledby="bill-modal-title"
      aria-describedby="bill-modal-description"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
            {value === 0 ? bill.shortTitleEn : bill.shortTitleGa}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          flex: 1, // Take remaining space
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Prevent content overflow
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="English" />
            <Tab label="Gaeilge" />
          </Tabs>
        </Box>
        <Box
          sx={{
            flex: 1,
            overflow: "auto", // Enable scrolling for tab content
            "& .MuiBox-root": { height: "100%" },
          }}
        >
          <TabPanel value={value} index={0}>
            <Box
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                typography: "body1",
              }}
            >
              {bill.longTitleEn.replace(/<[^>]*>/g, "")}
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Box
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                typography: "body1",
              }}
            >
              {bill.longTitleGa.replace(/<[^>]*>/g, "")}
            </Box>
          </TabPanel>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
ModalTabPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bill: PropTypes.shape({
    shortTitleEn: PropTypes.string.isRequired,
    longTitleEn: PropTypes.string.isRequired,
    longTitleGa: PropTypes.string.isRequired,
  }),
};