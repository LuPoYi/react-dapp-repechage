import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import { maskAddress } from '../../utils/helper'

const Navbar = ({ account }) => {
  const displayAccount = account ? maskAddress(account) : 'No wallet connected'

  return (
    <Box>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Typography variant="h5" component="div">
            DApp Demo - Ropsten
          </Typography>

          <Typography variant="h6" component="div" style={{ whiteSpace: 'nowrap' }}>
            {displayAccount}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
