import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Select } from "../../components/Select.component";
import { changeAccount, selectAccounts, selectActiveAccount } from "./loginSlice";

export const AccountSelector = () => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(selectAccounts);
  const activeAccount = useAppSelector(selectActiveAccount);

  const accountOptions = useMemo(() => accounts.map(account => ({ label: account, value: account })), [accounts]);

  const handleSelectAccount = (value: string) => {
    dispatch(changeAccount(value));
  }

  return (
    <Select value={activeAccount} id="account" onChange={handleSelectAccount} label="Active account" options={accountOptions} />
  )
}