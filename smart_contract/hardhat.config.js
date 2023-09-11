//https://eth-goerli.g.alchemy.com/v2/Z3YwQbnOn6vT-zpKlTyZe4zfxpNiRVNF


require('@nomiclabs/hardhat-waffle')


module.exports = {
  solidity: '0.8.19',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/Z3YwQbnOn6vT-zpKlTyZe4zfxpNiRVNF',
      accounts: [ '3c937863d1de36055e8629cd7f19b59cdbb9f30d4d2ba3d3f1e98be193d94726']
    }
  }
}