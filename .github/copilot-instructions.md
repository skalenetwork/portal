- always use bun as a package manager
- use the latest typescript standard
- for the initial setup, run `bun i` to install dependencies and `bun build:mainnet` to pull assets
- run `bun dev` to start the server; it generates metadata first

- single package, everything under `src`, imported through the `@/` alias
- `src/core` holds SKALE primitives (chains, endpoints, units, ABIs), `src/bridge` the bridge widget, `src/lib` portal domain logic
- bridge configs are stored in `config/[NETWORK_NAME]` folders

- always keep the changes minimal and purposeful
- focus on fixing the exact problem or implementing the exact feature
- keep the code simple, do not write defensive code
- do not write scripts to test your changes
- do not describe your changes in details after you made changes, focus on writing code
- do not generate any documentation, the code should be self-explanatory
- do not generate any in-line comments
- for the new files, always add a license header, same format as in the existing files
- no commented out code
- no console logs in production code
- no unused imports
- no redundant code - move repeated logic into helper functions

- check `.prettierrc` for formatting rules
