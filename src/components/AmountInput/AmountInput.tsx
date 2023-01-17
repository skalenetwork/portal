import React from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import './AmountInput.scss';

export default function AmountInput(props: any) {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setAmount(event.target.value);
  };

  const setMaxAmount = () => {
    props.setAmount(props.token.balance);
  }

  if (!props.token) return (<div></div>);
  return (
    <div className='mp__flex mp__inputAmount'>
      <div className='mp__flex mp__flexGrow'>
        <TextField
          type="number"
          variant="standard"
          placeholder="0.00"
          value={props.amount}
          onChange={handleChange}
          disabled={props.loading || props.amountLocked}
        />
      </div>
      <div className='mp__flex'>
        <Button
          color="primary"
          size="small"
          className='mp__btnChain'
          onClick={setMaxAmount}
          disabled={props.loading || !props.token.balance || props.amountLocked}
        >
          MAX
        </Button>
      </div>
    </div>
  )
}
