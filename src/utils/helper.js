const maskAddress = (address) => address && `${address.slice(0, 5)}...${address.slice(-4)}`

export { maskAddress }
