import '@nomiclabs/hardhat-ethers'
import { exec } from 'child_process'
import fs from 'fs'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import path from 'path'

export class AddressExporterHardhatRuntimeEnvironmentField {
  hre: HardhatRuntimeEnvironment

  constructor(hre: HardhatRuntimeEnvironment) {
    this.hre = hre
  }

  public async save(contracts: Record<string, string>) {
    // Create adresses/ directory
    const addressesDir = this.hre.config.addressExporter.outDir
    fs.mkdirSync(addressesDir, { recursive: true })

    // Normalizes all addresses
    for (const contractKey of Object.keys(contracts)) {
      contracts[contractKey] = this.hre.ethers.utils.getAddress(contracts[contractKey])
    }

    // Create {chainId}.ts
    const chainId = this.hre.network.config.chainId || 1337
    const addressesFilePath = path.join(addressesDir, `${chainId}.ts`)
    const addressesFileContents = `export const ContractAddresses_${chainId} = ${JSON.stringify(
      contracts,
      null,
      2
    )}`
    fs.writeFileSync(addressesFilePath, addressesFileContents)

    // Create addresses.ts (index-file)
    const chainIds = fs
      .readdirSync(addressesDir)
      .filter((name) => name?.endsWith('.ts') && !['index.ts', 'addresses.ts'].includes(name))
      .map((name) => name?.replace('.ts', ''))
    chainIds.sort()
    let indexFileContents = chainIds.reduce(
      (acc, val) => acc + `import { ContractAddresses_${val} } from './${val}'\n`,
      ''
    )
    indexFileContents += `export const ContractAddresses = {`
    indexFileContents += chainIds.reduce(
      (acc, val) => acc + `'${val}': ContractAddresses_${val},\n`,
      ''
    )
    indexFileContents += `}\n`
    indexFileContents += `export type ContractAddressesKey = keyof typeof ContractAddresses`
    const indexFilePath = path.join(addressesDir, 'addresses.ts')
    fs.writeFileSync(indexFilePath, indexFileContents)

    // Prettify all generated files
    if (this.hre.config.addressExporter.runPrettier) {
      await exec(`npx prettier --write ${addressesDir}`)
    }
  }
}
