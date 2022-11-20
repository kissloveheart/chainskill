const { from } = require("rxjs");

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        ganache: {
            host: "localhost",
            port: 7545,
            network_id: "*" // Match any network id
        },
        chainlist: {
            host: "localhost",
            port: 8545,
            network_id: "*", // Match any network id
            gas: 4700000
            //from: '0xeAD3dd97693e9Bbc1D9E5f829b4C499cbe5A7873'
        }
    },
    // Configure your compilers
    compilers: {
        solc: {
            version: '0.8.17',
            settings: {          // See the solidity docs for advice about optimization and evmVersion
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }
    }
};
