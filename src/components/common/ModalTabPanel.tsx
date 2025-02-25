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

/**
 * Props for the modal dialog that shows bill details
 * @property {boolean} open - Controls whether the modal is visible
 * @property {function} onClose - Function to call when modal should close
 * @property {Bill | null} bill - The bill data to display, null when no bill selected
 */
interface ModalProps {
  open: boolean;
  onClose: () => void;
  bill: Bill | null;
}

/**
 * Props for each tab panel that shows bill content
 * @property {ReactNode} children - Content to show in the tab
 * @property {number} index - The tab's index number
 * @property {number} value - Currently selected tab index
 */
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * Individual tab panel component that handles showing/hiding content
 * based on which tab is selected
 */
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
      {/* Only render content when tab is active to save memory */}
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Modal component that shows bill details in both English and Irish
 * Features:
 * - Tabs to switch between languages
 * - Scrollable content area
 * - Responsive sizing
 * - Accessible markup
 * - Clean HTML stripping from content
 */
export const ModalTabPanel = ({ open, onClose, bill }: ModalProps) => {
  // Track which language tab is currently selected (0 = English, 1 = Irish)
  const [value, setValue] = React.useState(0);

  // Handle switching between language tabs
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Don't render anything if no bill is selected
  if (!bill) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            height: "80vh", // Use 80% of viewport height
            maxHeight: "600px", // But don't exceed 600px
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
      aria-labelledby="bill-modal-title"
      aria-describedby="bill-modal-description"
    >
      {/* Modal header with dynamic title based on selected language */}
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {value === 0 ? bill.shortTitleEn : bill.shortTitleGa}
          <IconButton onClick={onClose} aria-label="close dialog">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Main content area with tabs and bill text */}
      <DialogContent
        sx={{
          flex: 1, // Take up remaining space
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Prevent double scrollbars
        }}
      >
        {/* Language selection tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="English" />
            <Tab label="Gaeilge" />
          </Tabs>
        </Box>

        {/* Scrollable content area */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            "& .MuiBox-root": { height: "100%" },
          }}
        >
          {/* English content tab */}
          <TabPanel value={value} index={0}>
            <Box
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                typography: "body1",
              }}
            >
              {/* Strip HTML tags from content */}
              {bill.longTitleEn.replace(/<[^>]*>/g, "")}
            </Box>
          </TabPanel>

          {/* Irish content tab */}
          <TabPanel value={value} index={1}>
            <Box
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                typography: "body1",
              }}
            >
              {/* Strip HTML tags from content */}
              {bill.longTitleGa.replace(/<[^>]*>/g, "")}
            </Box>
          </TabPanel>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// Runtime type checking for props
ModalTabPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bill: PropTypes.shape({
    shortTitleEn: PropTypes.string.isRequired,
    longTitleEn: PropTypes.string.isRequired,
    longTitleGa: PropTypes.string.isRequired,
  }),
};