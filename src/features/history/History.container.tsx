import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { LoadingContent } from "../../components/LoadingContent";
import { selectActiveAccount } from "../login/loginSlice";
import {
  getHistoryAsync,
  selectHistoryLoading,
  selectTransactions,
} from "./historySlice";
import { TransactionItem } from "./TransactionItem.component";

export const History = () => {
  const dispatch = useAppDispatch();
  const selectedAccount = useAppSelector(selectActiveAccount);
  const isHistoryLoading = useAppSelector(selectHistoryLoading);
  const transactions = useAppSelector(selectTransactions);
  useEffect(() => {
    if (selectedAccount) {
      dispatch(getHistoryAsync(selectedAccount));
    }
  }, [dispatch, selectedAccount]);
  return (
    <Accordion defaultExpanded variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">History</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ overflow: "auto", maxHeight: "70vh" }}>
        <LoadingContent isLoading={isHistoryLoading}>
          <List>
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.hash}
                transaction={transaction}
                isReceiver={transaction.to === selectedAccount}
              />
            ))}
          </List>
        </LoadingContent>
      </AccordionDetails>
    </Accordion>
  );
};
