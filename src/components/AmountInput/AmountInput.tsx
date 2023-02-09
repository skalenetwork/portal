import React from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import './AmountInput.scss';

export default function AmountInput(props: any) {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setAmount(event.target.value);
  };

  const setMaxAmount = () => {
    props.setAmount(props.balance);
  }

  const disabled = props.loading || !props.balance;

  if (!props.token) return (<div></div>);
  return (
    <div className={ 'mp__flex mp__inputAmount ' + (disabled ? 'mp__inputAmountDisabled' : null)}>
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
      {props.maxBtn ? <div className='mp__flex'>
        <Button
          color="primary"
          size="small"
          className='mp__btnChain'
          onClick={setMaxAmount}
          disabled={props.loading || !props.balance || props.amountLocked}
        >
          MAX
        </Button>
      </div> : null}
      
    </div>
  )
}
