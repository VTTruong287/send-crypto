import { MAX_RETRY_LIMIT, MAX_ROW_PER_JOB, TransactionReceiptStatus } from "@src/consts/config";
import { ProcessStatusEnum, Row } from "./row";
import { Blockchain } from "@src/controllers";
import async from "async";

export default class RowJob {
  public retry: number;
  public rows: Row[];
  public blockchain: Blockchain;
  public increament: number;
  public range: number;

  constructor(rows: Row[], blockchain: Blockchain, increament: number, range: number) {
    this.retry = 0;
    this.rows = rows;
    this.blockchain = blockchain;
    this.increament = increament;
    this.range = range;
  }

  /**
   * process
   * @returns
   */
  public async process(fromAddress: string) {
    await this.blockchain.getNonce(fromAddress);

    await async.parallelLimit(
      this.rows.map((row, idx) => {
        return async () => {
          if (row.status == ProcessStatusEnum.NONE) {
            console.log("--- process: ", row.address, this.retry);
            const receipt = await this.blockchain.sendNativeCoin(
              process.env.FROM_ADDRESS,
              row.address,
              row.amount,
              process.env.PRIVATE_KEY,
              this.increament + idx
            );
            if (receipt?.status) {
              row.transactionId = receipt.transactionHash.toString();
    
              if (receipt.status == TransactionReceiptStatus.SUCCESS) {
                row.status = ProcessStatusEnum.SUCCESS;
                return;
              }
            }
            if (this.retry >= MAX_RETRY_LIMIT - 1) {
              row.status = ProcessStatusEnum.FAIL;
              return;
            }
            this.retry++;
          }
        };
      }), MAX_ROW_PER_JOB
    );
  }
}
