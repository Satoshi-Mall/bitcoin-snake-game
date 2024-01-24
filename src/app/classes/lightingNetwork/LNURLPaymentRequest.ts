interface LNURLPaymentRequest {
  description_hash: string;
  callback: string;
  amount: number;
  comment: string;
  description: string;
}

export default LNURLPaymentRequest