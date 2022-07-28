import { extendConfig, extendEnvironment } from "hardhat/config"
import { lazyObject } from "hardhat/plugins"
import { HardhatConfig, HardhatUserConfig } from "hardhat/types"
import path from "path"
import { AddressExporterHardhatRuntimeEnvironmentField } from "./AddressExporterHardhatRuntimeEnvironmentField"
import "./type-extensions"

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    // `outDir`
    let outDir = userConfig.addressExporter?.outDir;
    if (outDir === undefined) {
      outDir = path.join(config.paths.root, "addresses");
    } else if (!path.isAbsolute(outDir)) {
      outDir = path.normalize(path.join(config.paths.root, outDir));
    }

    // `runPrettier`
    const runPrettier  = userConfig.addressExporter?.runPrettier || false;

    // Store accumulated settings
    config.addressExporter = {
      outDir,
      runPrettier,
    }
  }
);

extendEnvironment((hre) => {
  hre.addressExporter = lazyObject(() => new AddressExporterHardhatRuntimeEnvironmentField(hre));
});
