import { MAX_RETRY_LIMIT, TransactionReceiptStatus } from "@src/consts/config";
import { ProcessStatusEnum, Row } from "./row";
import { Blockchain } from "@src/controllers";

export default class RowJob {
  public retry: number;
  public row: Row;
  public blockchain: Blockchain;

  constructor(row: Row, blockchain: Blockchain) {
    this.retry = 0;
    this.row = row;
    this.blockchain = blockchain;
  }

  public async process() {
    while (this.retry < MAX_RETRY_LIMIT && this.row.status == ProcessStatusEnum.NONE) {
      console.log('--- process: ', this.row.address, this.retry);
      const receipt = await this.blockchain.send(process.env.FROM_ADDRESS, this.row.address, this.row.amount, process.env.PRIVATE_KEY);
      if (receipt?.status) {
        this.row.transactionId = receipt.transactionHash.toString();

        if (receipt.status == TransactionReceiptStatus.SUCCESS) {
          this.row.status = ProcessStatusEnum.SUCCESS;
        }
      }
      if (this.retry >= MAX_RETRY_LIMIT - 1 ) {
        this.row.status = ProcessStatusEnum.FAIL;
      }
      this.retry++;

      await new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve(null);
        }, 1000)
      );
    }
  }
}
