import Web3, { Transaction } from "web3";

import { Network } from "@src/consts/networks";

export default class Blockchain {
  public provider: Web3;
  public network: Network;
  public currentNetworkIdx: number;
  public nonce: bigint;

  constructor(network: Network, privateKey: string) {
    this.network = network;
    // FetchError: invalid json response body at https://sepolia.infura.io/v3/ reason: Unexpected token 'p', "project id"... is not valid JSON
    this.currentNetworkIdx = 0;
    this.nonce = 0n;
    this.provider = new Web3(network.RPCs[this.currentNetworkIdx]);
  }

  /**
   * sendNativeCoin
   * @param fromAddress 
   * @param toAddress 
   * @param amount 
   * @param privateKey 
   * @param increament 
   * @returns 
   */
  public async sendNativeCoin(fromAddress: string, toAddress: string, amount: string, privateKey: string, increament: number) {
    /*
    Transaction receipt: {
      blockHash: '0x2324b73b4faa3a498daa19a313aafdd8f7456082395c3fe81c34104f444002a3',
      blockNumber: 5640655n,
      cumulativeGasUsed: 24861125n,
      effectiveGasPrice: 1000447579n,
      from: '0xc6f9d937bb6a6884004fab2fe139a1543ee70a55',
      gasUsed: 21000n,
      logs: [],
      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      status: 1n,
      to: '0xe84c387b8cb670241f49f70e1fd8f110f74d0f02',
      transactionHash: '0x4ef08966195a3bd1fcb895538e8d5780265aed02d1f2b62fa9ea4a0a7993a141',
      transactionIndex: 56n,
      type: 0n
    }
    */
    try {
      // var count = (await this.provider.eth.getTransactionCount(fromAddress)) + BigInt(increament);
      const privateKeyBuffer = Buffer.from(privateKey, 'hex');
      const amountToSend = this.provider.utils.toWei(amount, "ether");
      const gas = 21000; // Gas limit
      const gasPrice = await this.provider.eth.getGasPrice();
      const txObject: Transaction = {
        from: fromAddress,
        to: toAddress,
        value: amountToSend,
        gasLimit: gas,
        gasPrice: gasPrice,
        // nonce: Web3.utils.toHex(count)
      };
      console.log('txObject: ', txObject);

      const signedTx = await this.provider.eth.accounts.signTransaction(txObject, privateKeyBuffer);
      const receipt = await this.provider.eth.sendSignedTransaction(signedTx.rawTransaction);

      console.log('Transaction receipt:', receipt);
      return receipt;
    } catch (error) {
      console.log('ERR - send: ', error);
      return null;
    }
  }
}
