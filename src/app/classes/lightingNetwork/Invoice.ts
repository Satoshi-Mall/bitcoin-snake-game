interface Invoice {
  payment_hash: string;
  payment_request: string;
  checking_id: string;
  lnurl_response: null | any; // Replace 'any' with the actual type if you have a specific type for lnurl_response
}

export default Invoice