# How to run
- S1: Must config .env file
PRIVATE_KEY: private key of sending wallet
FROM_ADDRESS: address of sending wallet
TEST_MODE: 
+ If you want run on Testnet SepoliaETH, set TEST_MODE=true
+ If you want run on Mainnet Arbitrum, ignore TEST_MODE

- S2: Put send.csv file with following format `Amount,Address` to folder /input/
+ Amount: quantity of ETH you want to send
+ Address: receive address you want to send

- S3: Run `npm run dev on cmd`

- S4: Get result csv file after runing at folder /out/
Output format file: `Amount,Address,Transaction Id,Status, Error message`
+ Amount: quantity of ETH you want to send
+ Address: receive address you want to send
+ Transaction Id: Corresponding Transaction Id on the network
+ Status: Success/Fail
+ Error message: If it gets Fail status, it may be included Error message
