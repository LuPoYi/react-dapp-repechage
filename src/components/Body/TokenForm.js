import { useState } from 'react'
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { chains } from '../wallet/connectors'

const TokenForm = ({
  address,
  amount,
  active,
  chainId,
  handleAddressOnChange,
  handleAmountOnChange,
  TokenState,
  handleTokenAddressOnChange,
  handleSendTokenOnClick,
}) => {
  const { tokenAddress, symbol, balance } = TokenState
  const floatedBalance = parseFloat(balance).toFixed(4)
  const [isTokenAddressDisable, setIsTokenAddressDisable] = useState(true)

  return (
    <Card style={{ filter: !active && 'blur(2px)', marginBottom: 30 }}>
      <CardHeader
        title={`Send ERC20 ${symbol}`}
        subheader={symbol ? `${floatedBalance} ${symbol}` : 'Invalid token address'}
        action={<Typography style={{ margin: 8 }}>{chains[chainId]}</Typography>}
      />
      <CardContent>
        <TextField
          fullWidth
          label="ERC20 Token Address"
          variant="outlined"
          placeholder="Erc20 Token Address"
          style={{ marginBottom: 10 }}
          value={tokenAddress}
          onChange={handleTokenAddressOnChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">{symbol || ''}</InputAdornment>,
          }}
          disabled={isTokenAddressDisable}
          onClick={() => setIsTokenAddressDisable(false)}
        />

        <TextField
          fullWidth
          label="Address"
          variant="outlined"
          placeholder="Send to"
          style={{ marginBottom: 10 }}
          value={address}
          onChange={handleAddressOnChange}
        />
        <TextField
          fullWidth
          label="Amount"
          type="number"
          variant="outlined"
          placeholder="0.1"
          style={{ marginBottom: 10 }}
          value={amount}
          onChange={handleAmountOnChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">{symbol || ''}</InputAdornment>,
          }}
        />

        <Button
          fullWidth
          color="primary"
          variant="contained"
          onClick={handleSendTokenOnClick(address, amount)}
          endIcon={<SendIcon />}
          disabled={!symbol}
        >
          Send
        </Button>
      </CardContent>
    </Card>
  )
}

export default TokenForm
