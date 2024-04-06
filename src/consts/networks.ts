export type Network = {
  name: string;
  chainId: number;
  chainIdHex: string;
  nativeCoin: string;
  RPCs: string[];
}

export const ARB: Network = {
  name: "Arbitrum One",
  chainId: 42161,
  chainIdHex: "0xa4b1",
  nativeCoin: "ETH",
  RPCs: [
    "https://arbitrum-mainnet.infura.io",
    "https://arb1.arbitrum.io/rpc",
    "https://1rpc.io/arb",
    "https://public.stackup.sh/api/v1/node/arbitrum-one",
    "https://arb-mainnet-public.unifra.io",
    "https://arbitrum-one.publicnode.com",
    "https://arbitrum-one-rpc.publicnode.com",
    "wss://arbitrum-one.publicnode.com",
  ],
};

export const SepoliaETH: Network = {
  name: "Sepolia ETH",
  chainId: 11155111,
  chainIdHex: "0xaa36a7",
  nativeCoin: "SepoliaETH",
  RPCs: [
    "https://sepolia.drpc.org",
    "https://rpc.sepolia.org",
    "wss://sepolia.drpc.org"
  ],
}
