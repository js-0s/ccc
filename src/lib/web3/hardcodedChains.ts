export const hardcodedChains = [
  {
    rpcnw: 'https://rpc-regen.keplr.app',
    rpc: 'https://rpc.cosmos.directory/regen',
    rest: 'https://lcd-regen.keplr.app',
    chainId: 'regen-1',
    chainName: 'Regen',
    chainSymbolImageUrl:
      'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/regen/chain.png',
    stakeCurrency: {
      coinDenom: 'REGEN',
      coinMinimalDenom: 'uregen',
      coinDecimals: 6,
      coinGeckoId: 'regen',
      coinImageUrl:
        'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/regen/uregen.png',
    },
    walletUrl: 'https://wallet.keplr.app/chains/regen',
    walletUrlForStaking: 'https://wallet.keplr.app/chains/regen',
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: 'regen',
      bech32PrefixAccPub: 'regenpub',
      bech32PrefixValAddr: 'regenvaloper',
      bech32PrefixValPub: 'regenvaloperpub',
      bech32PrefixConsAddr: 'regenvalcons',
      bech32PrefixConsPub: 'regenvalconspub',
    },
    currencies: [
      {
        coinDenom: 'REGEN',
        coinMinimalDenom: 'uregen',
        coinDecimals: 6,
        coinGeckoId: 'regen',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/regen/uregen.png',
      },
      {
        coinDenom: 'NCT',
        coinMinimalDenom: 'eco.uC.NCT',
        coinDecimals: 6,
        coinGeckoId: 'toucan-protocol-nature-carbon-tonne',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'REGEN',
        coinMinimalDenom: 'uregen',
        coinDecimals: 6,
        coinGeckoId: 'regen',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/regen/uregen.png',
        gasPriceStep: {
          low: 0.015,
          average: 0.025,
          high: 0.04,
        },
      },
    ],
    features: ['authz-msg-revoke-fixed'],
  },
  {
    chainId: 'regen-redwood-1',
    chainName: 'Regen Redwood Testnet',
    rpc: 'http://redwood.regen.network:26657/',
    rest: 'http://redwood.regen.network:1317/',
    stakeCurrency: {
      coinDenom: 'REGEN',
      coinMinimalDenom: 'uregen',
      coinDecimals: 6,
    },
    bip44: { coinType: 118 },
    bech32Config: {
      bech32PrefixAccAddr: 'regen',
      bech32PrefixAccPub: 'regenpub',
      bech32PrefixValAddr: 'regenvaloper',
      bech32PrefixValPub: 'regenvaloperpub',
      bech32PrefixConsAddr: 'regenvalcons',
      bech32PrefixConsPub: 'regenvalconspub',
    },
    currencies: [
      {
        coinDenom: 'REGEN',
        coinMinimalDenom: 'uregen',
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'REGEN',
        coinMinimalDenom: 'uregen',
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.04,
        },
      },
    ],
    features: ['stargate'],
  },
];
