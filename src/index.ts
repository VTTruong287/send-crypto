import path from "path";

import { SepoliaETH } from "./consts/networks";
import { Blockchain, SpreadSheet } from "./controllers";
import RowJob from "./models/rowJob";

import "dotenv/config";

const main = async () => {
  const fromAddress = process.env.FROM_ADDRESS;
  const privateKey = process.env.PRIVATE_KEY
  console.log("Hello World! ");

  const spreadSheet = new SpreadSheet(
    path.join(__dirname, "input/send.csv"), 
    path.join(__dirname, "output"), 
    "rs.csv"
  );
  const blockchain = new Blockchain(SepoliaETH, privateKey);
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
  for (let i = 0; i < spreadSheet.rows.length; i++) {
    rowJobs.push(new RowJob(spreadSheet.rows[i], blockchain, i, spreadSheet.rows.length))
  }

  // await async.parallelLimit(rowJobs.map((rowJob: RowJob) => {
  //   return async () => {
  //     await rowJob.process();
  //   }
  // }), 10)

  for (let rowJob of rowJobs) {
    await rowJob.process();
  }

  await spreadSheet.export();
};

main();
