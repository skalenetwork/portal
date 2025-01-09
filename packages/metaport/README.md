# SKALE Metaport Widget

[![Discord](https://img.shields.io/discord/534485763354787851.svg)](https://discord.gg/vvUtWJB)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/skalenetwork/metaport/publish.yml)
![npm](https://img.shields.io/npm/dm/@skalenetwork/metaport)
![NPM](https://img.shields.io/npm/l/@skalenetwork/metaport)
![GitHub top language](https://img.shields.io/github/languages/top/skalenetwork/metaport)

Metaport is a Typescript/Javascript widget that could be embeded into a web application to add IMA functionality to any SKALE dApp.


## Documentation

See https://docs.skale.network/metaport/1.1.x/

## Development

### Storybook preview

```
bash prepare_meta.sh && bun install && bun build:lib
bun dev
```

### Debug mode

To enable debug mode, set `debug` environment variable to `true`:

```Javascript
const metaport = new Metaport({
    ...
    debug: false // Enable debug mode (optional, default = false)
    ...
});
```

Additionally, you can enable debug logs in developer console by enabling `Verbose` level of logs.


#### Linter git hook

Be sure to add pre-commit git hook:

```shell
echo 'bun lint' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Security and Liability

The Metaport UI and code is WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

## License

![GitHub](https://img.shields.io/github/license/skalenetwork/metaport.svg)

All contributions are made under the [GNU Lesser General Public License v3](https://www.gnu.org/licenses/lgpl-3.0.en.html). See [LICENSE](LICENSE).
