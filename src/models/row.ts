export enum ProcessStatusEnum {
  NONE = "None",
  FAIL = "Fail",
  SUCCESS = "Success",
}

export class Row {
  public address: string;
  public amount: string;
  public transactionId: string;
  public status: ProcessStatusEnum;
}
