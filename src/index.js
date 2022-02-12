import ReactDOM from 'react-dom'
import App from './App'
import { ethers } from 'ethers'
import { Web3ReactProvider } from '@web3-react/core'

const getLibrary = (provider) => {
  return new ethers.providers.Web3Provider(provider)
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <App />
  </Web3ReactProvider>,
  document.getElementById('root')
)
