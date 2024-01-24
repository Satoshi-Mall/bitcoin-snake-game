import { Injectable } from '@angular/core';
import LNURLScanResult from '../classes/lightingNetwork/LNURLScanResult';
import LNURLPaymentRequest from '../classes/lightingNetwork/LNURLPaymentRequest';

@Injectable({
  providedIn: 'root'
})
export class PlayerProviderService {
  playerLNAddress: string | undefined;
  lnAddressData: LNURLScanResult | undefined;
  constructor() { }

  setAddress(playerLNAddress: string) {
    this.playerLNAddress = playerLNAddress;
  }


  setLNAddressData(data: LNURLScanResult) {
    this.lnAddressData = data;
  }

  getPaymentRequest(amount: number): LNURLPaymentRequest {
    return {
      description_hash: this.lnAddressData?.description_hash,
      callback: this.lnAddressData?.callback,
      amount: amount * 1000,
      comment: 'Snake Game Apple Eaten',
      description: ''
    } as LNURLPaymentRequest
  }

}
