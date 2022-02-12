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

const Erc20Form = ({
  address,
  amount,
  active,
  chainId,
  handleAddressOnChange,
  handleAmountOnChange,
  erc20State,
  handleErc20TokenAddressOnChange,
  handleSendErc20OnClick,
}) => {
  const { tokenAddress, symbol, balance } = erc20State
  const floatedBalance = parseFloat(balance).toFixed(4)

  return (
    <Card style={{ minWidth: 400, filter: !active && 'blur(2px)', marginBottom: 30 }}>
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
          onChange={handleErc20TokenAddressOnChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">{symbol || ''}</InputAdornment>,
          }}
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
          onClick={handleSendErc20OnClick(address, amount)}
          endIcon={<SendIcon />}
          disabled={!symbol}
        >
          Send
        </Button>
      </CardContent>
    </Card>
  )
}

export default Erc20Form
