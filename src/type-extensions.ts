import "hardhat/types/config"
import "hardhat/types/runtime"

import { AddressExporterHardhatRuntimeEnvironmentField } from "./AddressExporterHardhatRuntimeEnvironmentField"

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    addressExporter?: {
      outDir?: string;
      runPrettier?: boolean;
    }
  }
  export interface HardhatConfig {
    addressExporter: {
      outDir: string;
      runPrettier: boolean;
    }
  }
}

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    addressExporter: AddressExporterHardhatRuntimeEnvironmentField;
  }
}
