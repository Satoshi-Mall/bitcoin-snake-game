interface LNURLScanResult {
  domain: string;
  callback: string;
  maxSendable: number;
  minSendable: number;
  metadata: string;
  commentAllowed: number;
  tag: string;
  allowsNostr: boolean;
  nostrPubkey: string;
  kind: string;
  fixed: boolean;
  description_hash: string;
  description: string;
  targetUser: string;
}
export default LNURLScanResult