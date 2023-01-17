import React from "react";
import TextField from '@mui/material/TextField';


export default function AmountInput(props: any) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amounts = props.amounts;
    amounts[props.tokenId] = event.target.value;
    props.setAmounts(amounts);
  };
  return (
    <div className='inputAmount'>
      <TextField
        variant="filled"
        size='small'
        fullWidth
        type="number"
        label="Enter amount"
        placeholder="0"
        value={props.amount}
        onChange={handleChange}
        disabled={props.loading || props.amountLocked}
      />
    </div>
  )
}
