import { MenuItem, TextField } from "@mui/material";
import { useCallback } from "react";

export type SelectProps = {
  id: string;
  label?: string;
  value?: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

export const Select = ({
  id,
  label,
  value,
  options,
  onChange,
}: SelectProps) => {
  const handleChange = useCallback(
    () => (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <TextField
      id={id}
      select
      label={label}
      value={value}
      onChange={handleChange}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
