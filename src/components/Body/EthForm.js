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

const EthForm = ({
  balance,
  address,
  amount,
  active,
  chainId,
  handleAddressOnChange,
  handleAmountOnChange,
  handleSendEthOnClick,
}) => {
  const floatedBalance = parseFloat(balance).toFixed(4)

  return (
    <Card style={{ filter: !active && 'blur(2px)', marginBottom: 30 }}>
      <CardHeader
        title="Send ETH"
        subheader={`${floatedBalance} ETH`}
        action={<Typography style={{ margin: 8 }}>{chains[chainId]}</Typography>}
      />
      <CardContent>
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
            endAdornment: <InputAdornment position="end">Ether</InputAdornment>,
          }}
        />
        <Button
          fullWidth
          color="primary"
          variant="contained"
          onClick={handleSendEthOnClick(address, amount)}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </CardContent>
    </Card>
  )
}

export default EthForm
