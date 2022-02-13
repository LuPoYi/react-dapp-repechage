import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { maskAddress } from '../../utils/helper'
import { expolorURI } from '../../constants/env'

const History = ({ histories, fetchHistory }) => {
  return (
    <Card style={{ marginBottom: 30, background: 'antiquewhite' }}>
      <CardHeader
        title="History"
        action={<RefreshIcon style={{ cursor: 'pointer' }} onClick={fetchHistory} />}
      />
      <CardContent style={{ overflowX: 'auto' }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Txn Hash</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {histories.map(
              ({ txid, from, to, date, value, tokenValue, tokenName, isConfirmed }) => (
                <TableRow
                  key={txid}
                  style={{
                    background: !isConfirmed && 'burlywood',
                  }}
                >
                  <TableCell component="th" scope="row">
                    {date}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {isConfirmed ? (
                      <a href={`${expolorURI}tx/${txid}`} target="_blank" rel="noreferrer">
                        {maskAddress(txid)}
                      </a>
                    ) : (
                      maskAddress(txid)
                    )}
                  </TableCell>
                  <TableCell>{maskAddress(from)}</TableCell>
                  <TableCell>{maskAddress(to)}</TableCell>
                  <TableCell align="right">
                    {tokenValue ? `${tokenValue} ${tokenName}` : `${value} ETH`}
                  </TableCell>
                  <TableCell align="right">{isConfirmed ? 'OK' : 'Pending'}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default History
