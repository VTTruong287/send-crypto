import { ProcessStatusEnum, Row } from "@src/models/row";
import fs from "fs";
import os from "os";
import path from "path";

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
            status: ProcessStatusEnum.NONE
          })
        } catch (error) {
          this.rows.push({
            amount: columns[0],
            address: columns[1],
            transactionId: "",
            status: ProcessStatusEnum.FAIL
          })
        }
      })
      
      // console.log("content: ", this.rows)
    } catch(error) {
      console.log('--- getData - Error: ', error)
    }
  }

  public async export() {
    // Export rows
    if (!!this.rows) {
      let csvRows = [];
      csvRows.push("Amount,Address,Transaction Id,Status");
      this.rows.forEach((row, idx) => {
        csvRows.push([row.amount, row.address, row.transactionId, row.status].join(","));
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
