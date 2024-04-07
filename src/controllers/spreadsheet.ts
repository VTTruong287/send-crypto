import fs from "fs";
import os from "os";

import { ProcessStatusEnum, Row } from "@src/models/row";

export default class SpreadSheet {
  public rows: Row[];
  public inputFilePath: string;
  public outFileDirectory: string;
  public outFileName: string;

  constructor(inputFilePath: string, outFileDirectory: string, outFileName: string) {
    this.rows = [];
    this.inputFilePath = inputFilePath;
    this.outFileDirectory = outFileDirectory;
    this.outFileName = outFileName;
  }

  /**
   * getData
   * Get data from csv file with initialize input path
   */
  public async getData() {
    try {
      // Get data from file Path
      const content = await fs.promises.readFile(this.inputFilePath, "utf-8");
      const rows = content.split(os.EOL);

      rows?.forEach((row, idx) => {
        if (idx == 0) return;
        const columns = row.replace("\r", "").replace("\n", "").split(",")
        try {
          // Check the amount is number
          parseFloat(columns[0]?.trim())
          this.rows.push({
            amount: columns[0]?.trim(),
            address: columns[1]?.trim(),
            transactionId: "",
            status: ProcessStatusEnum.NONE,
            errorMsg: ""
          })
        } catch (error) {
          this.rows.push({
            amount: columns[0],
            address: columns[1],
            transactionId: "",
            status: ProcessStatusEnum.FAIL,
            errorMsg: ""
          })
        }
      })
      
      // console.log("content: ", this.rows)
    } catch(error) {
      console.log('--- getData - Error: ', error)
    }
  }

  /**
   * export
   * Write result after process to csv file
   */
  public async export() {
    if (!!this.rows) {
      let csvRows = [];
      csvRows.push("Amount,Address,Transaction Id,Status, Error message");
      this.rows.forEach((row, idx) => {
        csvRows.push([row.amount, row.address, row.transactionId, row.status, row.errorMsg].join(","));
      });

      if (!fs.existsSync(this.outFileDirectory)) {
        await fs.promises.mkdir(this.outFileDirectory, { recursive: true });
      }
      await fs.promises.writeFile(`${this.outFileDirectory}/${this.outFileName}`, csvRows.join(os.EOL), "utf-8");
      
      console.log("Export complete!!!");
    } else {
      console.log("ERR rows");
    }
  }
}
