# hardhat-address-exporter

A plugin for [hardhat](https://hardhat.org) that exports deployed contract addresses into typescript files. It is multichain compatible.


## Installation

```bash
npm install hardhat-address-exporter @nomiclabs/hardhat-ethers ethers hardhat
```

Import the plugin in your `hardhat.config.js`:

```js
require("hardhat-address-exporter");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "hardhat-address-exporter";
```

Also import the plugin in the scripts you are using it as well.


## Required plugins

- [@nomiclabs/hardhat-ethers](https://github.com/NomicFoundation/hardhat/tree/master/packages/hardhat-ethers)


## Environment extensions

This plugin extends the Hardhat Runtime Environment by adding an `addressExporter` field
whose type is `AddressExporterHardhatRuntimeEnvironmentField`. See *Usage* below for more information on how to use it.


## Configuration

This plugin extends the `HardhatUserConfig` object with an optional
`addressExporter` field.

This is an example of how to set it. It also shows the default values:

```ts
module.exports = {
  addressExporter: {
    outDir: path.resolve('./addresses'),
    runPrettier: false,
  }
};
```


## Usage

After deploying your contracts in a script (e.g. `scripts/deploy.ts`), call `hre.addressExporter.save(...)` with an object of contract-names (keys) and contract-addresses (values). The chain it's deployed on is automatically taken from `hre.network.config.chainId` and used as a filename for the addresses object.

This is an example: 

```ts
const ContractName = await ethers.getContractFactory('ContractName')
const contract = await ContractName.deploy()
await contract.deployed()

console.log('ContractName deployed to:', contract.address)

await hre.addressExporter.save({
  ContractName: contract.address,
})
```

This will result in two files being created in the `outDir` defined above (assuming the chain-id is 1337):

`1337.ts`
```ts
export const ContractAddresses_1337 = {
  ContractName: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
}
```

`addresses.ts`
```ts
import { ContractAddresses_1337 } from './1337'
export const ContractAddresses = { '1337': ContractAddresses_1337 }
export type ContractAddressesKey = keyof typeof ContractAddresses
```