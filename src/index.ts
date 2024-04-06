import path from "path";
import async from "async";

import { SepoliaETH, ARB } from "./consts/networks";
import { ProcessStatusEnum } from "./models/row";
import { MAX_RETRY_LIMIT, TransactionReceiptStatus } from "./consts/config";
import RowJob from "./models/rowJob";
import { SpreadSheet, Blockchain } from "./controllers";

import "dotenv/config";

const main = async () => {
  console.log("Hello World! ", process.env.PRIVATE_KEY);

  const spreadSheet = new SpreadSheet(
    path.join(__dirname, "input/send.csv"), 
    path.join(__dirname, "output"), 
    "rs.csv"
  );
  const blockchain = new Blockchain(SepoliaETH, process.env.PRIVATE_KEY);
  const rowJobs: RowJob[] = [];

  await spreadSheet.getData();

  // for (let row of spreadSheet.rows) {
  //   while (row.retry < MAX_RETRY_LIMIT && row.status == ProcessStatusEnum.NONE) {
  //     const receipt = await blockchain.send(process.env.FROM_ADDRESS, row.address, row.amount, process.env.PRIVATE_KEY);
  //     if (receipt?.status) {
  //       row.transactionId = receipt.transactionHash.toString();

  //       if (receipt.status == TransactionReceiptStatus.SUCCESS) {
  //         row.status = ProcessStatusEnum.SUCCESS;
  //       }
  //     }
  //     if (row.retry >= MAX_RETRY_LIMIT - 1 ) {
  //       row.status = ProcessStatusEnum.FAIL;
  //     }
  //     row.retry++;
  //   }
  // }
  for (let row of spreadSheet.rows) {
    rowJobs.push(new RowJob(row, blockchain))
  }

  await async.parallelLimit(rowJobs.map((rowJob: RowJob) => {
    return async () => {
      await rowJob.process();
    }
  }), 10)

  await spreadSheet.export();
};

main();
