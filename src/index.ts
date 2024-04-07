import path from "path";
import async from "async";

import { ARB, SepoliaETH } from "./consts/networks";
import { Blockchain, SpreadSheet } from "./controllers";
import RowJob from "./models/rowJob";
import { MAX_RETRY_LIMIT, MAX_ROW_PER_JOB } from "./consts/config";

import "dotenv/config";

const main = async () => {
  const fromAddress = process.env.FROM_ADDRESS;
  const privateKey = process.env.PRIVATE_KEY;
  const network = !!process.env.TEST_MODE ? SepoliaETH : ARB
  console.log(" ********** Send crypto - Start ", network);

  if (!fromAddress || !privateKey || !network) {
    throw("From address, private key, network can not be empty")
  }

  const spreadSheet = new SpreadSheet(
    path.join(__dirname, "input/send.csv"), 
    path.join(__dirname, "output"), 
    "rs.csv"
  );
  const blockchain = new Blockchain(network, privateKey);
  const rowJobs: RowJob[] = [];

  await spreadSheet.getData();

  for (let i = 0; i < spreadSheet.rows.length; i = i + MAX_ROW_PER_JOB) {
    const rows = spreadSheet.rows.slice(i, i + MAX_ROW_PER_JOB);
    rowJobs.push(new RowJob(rows, blockchain, i, spreadSheet.rows.length));
  }

  // await async.parallelLimit(rowJobs.map((rowJob: RowJob) => {
  //   return async () => {
  //     await rowJob.process(fromAddress);
  //   }
  // }), 3)

  for (let i = 0; i < MAX_RETRY_LIMIT; i++) {
    for (let rowJob of rowJobs) {
      await rowJob.process(fromAddress);
    }
  }

  await spreadSheet.export();
};

main();
