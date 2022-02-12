import { AppBar, Box, Toolbar, Typography } from '@mui/material'

const Navbar = ({ account }) => {
  const displayAccount = account
    ? `${account.slice(0, 5)}...${account.slice(-4)}`
    : 'No wallet connected'

  return (
    <Box>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Typography variant="h5" component="div">
            Bob Web3 Demo - Ropsten
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
