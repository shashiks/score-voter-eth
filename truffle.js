const HDWalletProvider = require('truffle-hdwallet-provider')
const tag = require('./tags.json')

const mnemonic = tag.mnemonic


module.exports = {
  contracts_build_directory: "./../src/contracts",
  networks: {
    development: {
      host: "localhost",
      port: 9090,
      network_id: "1971" // Match any network id
    },
	rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/4tyFJoKtfMPAzxBwkHoM", 0)
      },
      network_id: 4
    }       
  }
};
