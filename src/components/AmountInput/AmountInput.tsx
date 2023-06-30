import React from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import './AmountInput.scss';

export default function AmountInput(props: any) {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(event.target.value) < 0) {
      props.setAmount('');
      return;
    }
    props.setAmount(event.target.value);
  };

  const disabled = props.loading || !props.balance;

  if (!props.token) return (<div></div>);
  return (
    <div className={'mp__flex mp__inputAmount ' + (disabled ? 'mp__inputAmountDisabled' : null)}>
      <div className='mp__flex mp__flexGrow'>
        <TextField
          type="number"
          variant="standard"
          placeholder="0.00"
          value={props.amount}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
