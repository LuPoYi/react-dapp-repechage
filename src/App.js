import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import Container from '@mui/material/Container'
import Snackbar from '@mui/material/Snackbar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Navbar from './components/Navbar'
import Wallet from './components/Body/Wallet'
import EthForm from './components/Body/EthForm'
import Erc20Form from './components/Body/Erc20Form'
import History from './components/Body/History'
import erc20Abi from './abi/erc20'
import { daiContract } from './constants/env'

function App() {
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(0)
  const [signer, setSigner] = useState()
  const [erc20Contract, setErc20Contract] = useState()
  const [erc20State, setErc20State] = useState({
    tokenAddress: daiContract,
    symbol: '',
    balance: '',
  })
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
  })
  const [tabValue, setTabValue] = useState(0)

  const { active, account, library, chainId, activate, deactivate } = useWeb3React()

  const handleConnectWalletOnClick = (connector) => async () => {
    try {
      await activate(connector)
    } catch (ex) {
      console.log(ex)
    }
  }

  const handleDisconnectWalletOnClick = async () => {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  const handleSendEthOnClick = (address, amount) => async () => {
    signer
      .sendTransaction({
        to: address,
        value: ethers.utils.parseEther(amount),
      })
      .then(({ hash }) => {
        setSnackbarState({ open: true, message: `Transaction sent. TXID: ${hash}` })
        setAmount('')
      })
      .catch((error) => {
        console.log('sendTransaction error', error)
        setSnackbarState({ open: true, message: error?.message })
      })
  }

  const handleSendErc20OnClick = (address, amount) => async () => {
    const decimals = await erc20Contract.decimals()

    erc20Contract
      .transfer(address, ethers.utils.parseUnits(amount, decimals))
      .then(({ hash }) => {
        setSnackbarState({ open: true, message: `Transaction sent. TXID: ${hash}` })
        setAmount('')
      })
      .catch((error) => {
        console.log('sendTransaction error', error)
        setSnackbarState({ open: true, message: error?.message })
      })
  }
  const handleTabOnChange = (_event, newValue) => setTabValue(newValue)
  const handleSnackbarOnClose = () => setSnackbarState({ open: false, message: '' })
  const handleAddressOnChange = (e) => setAddress(e.target.value)
  const handleAmountOnChange = (e) => setAmount(e.target.value)
  const handleErc20TokenAddressOnChange = (e) =>
    setErc20State({ ...erc20State, tokenAddress: e.target.value })

  useEffect(() => {
    if (library) {
      const fetchSigner = async () => {
        setSigner(library.getSigner())
        setBalance(ethers.utils.formatEther(await library.getBalance(account)))
      }

      fetchSigner()
    }
  }, [library, account])

  useEffect(() => {
    if (account && signer) {
      const fetchErc20Token = async () => {
        try {
          const erc20 = new ethers.Contract(erc20State.tokenAddress, erc20Abi, signer)
          const decimals = await erc20.decimals()
          setErc20Contract(erc20)
          setErc20State({
            ...erc20State,
            symbol: await erc20.symbol(),
            balance: ethers.utils.formatUnits(await erc20.balanceOf(account), decimals),
          })
        } catch (ex) {
          setErc20State({
            ...erc20State,
            symbol: '',
            balance: '',
          })
          console.log('ex', ex)
        }
      }
      fetchErc20Token()
    }
  }, [account, signer, erc20State.tokenAddress])

  return (
    <div className="App">
      <Navbar account={account} />
      <Container maxWidth="sm" style={{ paddingTop: 30 }}>
        <Wallet
          account={account}
          active={active}
          handleConnectWalletOnClick={handleConnectWalletOnClick}
          handleDisconnectWalletOnClick={handleDisconnectWalletOnClick}
        />
        <Box style={{ width: '100%', bgcolor: 'background.paper' }}>
          <Tabs value={tabValue} onChange={handleTabOnChange}>
            <Tab label="ETH" />
            <Tab label="ERC20" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <EthForm
            balance={balance}
            address={address}
            amount={amount}
            active={active}
            chainId={chainId}
            handleAddressOnChange={handleAddressOnChange}
            handleAmountOnChange={handleAmountOnChange}
            handleSendEthOnClick={handleSendEthOnClick}
          />
        )}
        {tabValue === 1 && (
          <Erc20Form
            address={address}
            amount={amount}
            active={active}
            chainId={chainId}
            handleAddressOnChange={handleAddressOnChange}
            handleAmountOnChange={handleAmountOnChange}
            erc20State={erc20State}
            handleErc20TokenAddressOnChange={handleErc20TokenAddressOnChange}
            handleSendErc20OnClick={handleSendErc20OnClick}
          />
        )}

        <History />
      </Container>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={5000}
        open={snackbarState.open}
        message={snackbarState.message}
        onClose={handleSnackbarOnClose}
      />
    </div>
  )
}

export default App
