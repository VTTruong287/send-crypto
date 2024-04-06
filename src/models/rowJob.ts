import { MAX_RETRY_LIMIT, TransactionReceiptStatus } from "@src/consts/config";
import { ProcessStatusEnum, Row } from "./row";
import { Blockchain } from "@src/controllers";

export default class RowJob {
  public retry: number;
  public row: Row;
  public blockchain: Blockchain;
  public increament: number;
  public range: number;

  constructor(row: Row, blockchain: Blockchain, increament: number, range: number) {
    this.retry = 0;
    this.row = row;
    this.blockchain = blockchain;
    this.increament = increament;
    this.range = range;
  }

  public async process() {
    while (this.retry < MAX_RETRY_LIMIT && this.row.status == ProcessStatusEnum.NONE) {
      console.log('--- process: ', this.row.address, this.retry);
      const receipt = await this.blockchain.sendNativeCoin(process.env.FROM_ADDRESS, this.row.address, this.row.amount, process.env.PRIVATE_KEY, this.increament);
      if (receipt?.status) {
        this.row.transactionId = receipt.transactionHash.toString();

        if (receipt.status == TransactionReceiptStatus.SUCCESS) {
          this.row.status = ProcessStatusEnum.SUCCESS;
          return;
        }
      }
      if (this.retry >= MAX_RETRY_LIMIT - 1 ) {
        this.row.status = ProcessStatusEnum.FAIL;
        return;
      }
      this.retry++;
      this.increament += this.range * this.retry;

      await new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve(null);
        }, 1000)
      );
    }
  }
}
