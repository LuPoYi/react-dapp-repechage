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
import TokenForm from './components/Body/TokenForm'
import History from './components/Body/History'
import erc20Abi from './abi/erc20'
import { daiContract } from './constants/env'

function App() {
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(0)
  const [signer, setSigner] = useState()
  const [tokenContract, setTokenContract] = useState()
  const [TokenState, setTokenState] = useState({
    tokenAddress: daiContract,
    symbol: '',
    balance: '',
  })
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
  })
  const [tabValue, setTabValue] = useState(0)
  const [histories, setHistories] = useState([])
  const { active, account, library, chainId, activate, deactivate } = useWeb3React()

  const fetchHistory = async () => {
    const etherscanProvider = new ethers.providers.EtherscanProvider('ropsten')
    const rawHistories = await etherscanProvider.getHistory(account)
    const processedHistories = rawHistories
      .reverse()
      .map(({ hash, from, to, timestamp, value, data }) => {
        // decode daiContract value
        let tokenValue = 0
        let tokenName = ''
        if (to === daiContract && data !== '0x') {
          try {
            const decodeContractData = ethers.utils.defaultAbiCoder.decode(
              ['address', 'uint256'],
              ethers.utils.hexDataSlice(data, 4)
            )
            to = decodeContractData[0]
            tokenValue = decodeContractData[1]
            tokenName = 'DAI'
          } catch (ex) {
            console.log(ex)
          }
        }

        return {
          txid: hash,
          from,
          to,
          date: new Date(timestamp * 1000).toLocaleString('zh-TW'),
          value: ethers.utils.formatEther(value),
          tokenValue: tokenValue && ethers.utils.formatEther(tokenValue),
          tokenName: tokenName,
          isConfirmed: true,
        }
      })

    setHistories(processedHistories)
  }

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
    const value = ethers.utils.parseEther(amount)
    try {
      // sending transaction
      const tx = await signer.sendTransaction({
        to: address,
        value: value,
      })
      setSnackbarState({ open: true, message: `Transaction sent. TXID: ${tx.hash}` })
      setAmount('')
      setHistories([
        {
          date: new Date().toLocaleString('zh-TW'),
          txid: tx.hash,
          from: account,
          to: address,
          value: amount,
          isConfirmed: false,
        },
        ...histories,
      ])

      // waiting for confirmations
      await tx.wait()
      setSnackbarState({ open: true, message: `Transaction confirmed. TXID: ${tx}` })
      fetchHistory()
    } catch (ex) {
      console.log(ex)
      setSnackbarState({ open: true, message: ex?.message || 'error' })
    }
  }

  const handleSendTokenOnClick = (address, amount) => async () => {
    const decimals = await tokenContract.decimals()

    try {
      // sending transaction
      const tx = await tokenContract.transfer(address, ethers.utils.parseUnits(amount, decimals))
      setSnackbarState({ open: true, message: `Transaction sent. TXID: ${tx.hash}` })
      setAmount('')
      setHistories([
        {
          date: new Date().toLocaleString('zh-TW'),
          txid: tx.hash,
          from: account,
          to: address,
          tokenValue: amount,
          tokenName: TokenState.symbol,
          isConfirmed: false,
        },
        ...histories,
      ])

      // waiting for confirmations
      await tx.wait()
      setSnackbarState({ open: true, message: `Transaction confirmed. TXID: ${tx}` })
      fetchHistory()
    } catch (ex) {
      console.log(ex)
      setSnackbarState({ open: true, message: ex?.message || 'error' })
    }
  }
  const handleTabOnChange = (_event, newValue) => setTabValue(newValue)
  const handleSnackbarOnClose = () => setSnackbarState({ open: false, message: '' })
  const handleAddressOnChange = (e) => setAddress(e.target.value)
  const handleAmountOnChange = (e) => setAmount(e.target.value)
  const handleTokenAddressOnChange = (e) =>
    setTokenState({ ...TokenState, tokenAddress: e.target.value })

  useEffect(() => {
    if (library) {
      const fetchSigner = async () => {
        setSigner(library.getSigner())
        setBalance(ethers.utils.formatEther(await library.getBalance(account)))
        fetchHistory()
      }

      fetchSigner()
    }
  }, [library, account])

  // fetch erc20 Token
  useEffect(() => {
    if (account && signer) {
      const fetchTokenInfo = async () => {
        try {
          const contract = new ethers.Contract(TokenState.tokenAddress, erc20Abi, signer)
          const decimals = await contract.decimals()
          setTokenContract(contract)
          setTokenState({
            ...TokenState,
            symbol: await contract.symbol(),
            balance: ethers.utils.formatUnits(await contract.balanceOf(account), decimals),
          })
        } catch (ex) {
          setTokenState({
            ...TokenState,
            symbol: '',
            balance: '',
          })
          console.log('ex', ex)
        }
      }
      fetchTokenInfo()
    }
  }, [account, signer, TokenState.tokenAddress])

  return (
    <div className="App">
      <Navbar account={account} />
      <Container maxWidth="md" style={{ paddingTop: 30 }}>
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
          <TokenForm
            address={address}
            amount={amount}
            active={active}
            chainId={chainId}
            handleAddressOnChange={handleAddressOnChange}
            handleAmountOnChange={handleAmountOnChange}
            TokenState={TokenState}
            handleTokenAddressOnChange={handleTokenAddressOnChange}
            handleSendTokenOnClick={handleSendTokenOnClick}
          />
        )}

        <History histories={histories} />
      </Container>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={5000}
        open={snackbarState.open}
        message={snackbarState.message}
        onClose={handleSnackbarOnClose}
      />
    </div>
  )
}

export default App
