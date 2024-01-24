import { EventEmitter, Injectable } from '@angular/core';
import { LightingNetworkProviderService } from './lighting-network-provider.service';
import { PlayerProviderService } from './player-provider.service';
import LNURLPaymentRequest from '../classes/lightingNetwork/LNURLPaymentRequest';
import Invoice from '../classes/lightingNetwork/Invoice';

@Injectable({
  providedIn: 'root'
})
export class GamePlayProviderService {
  private _invoice: Invoice | undefined;
  private _invoiceIsPaid: boolean = false;
  observer: EventEmitter<boolean> | undefined;
  constructor(private lnProvider: LightingNetworkProviderService, private playerProvider: PlayerProviderService) { }

  public get invoiceIsPaid(): boolean {
    return this._invoiceIsPaid;
  }
  public set invoiceIsPaid(value: boolean) {
    this._invoiceIsPaid = value;
  }

  public get invoice(): Invoice | undefined {
    return this._invoice;
  }
  public set invoice(value: Invoice | undefined) {
    this._invoice = value;
  }

  gameIsValid() {
    return this.playerProvider.playerLNAddress != null && this.playerProvider.lnAddressData != null && this.invoice != null && this.invoiceIsPaid
  }


  appleIsEaten() {
    const data: LNURLPaymentRequest = this.playerProvider.getPaymentRequest(10);
    this.lnProvider.payAddress(data).subscribe((rsp) => {
      console.log(rsp)
    });
  }


  getObserver() {
    if (this.observer == null) {
      this.observer = new EventEmitter()
    }
    return this.observer;
  }

  onStartGame() {
    this.observer?.emit(true);
  }

  onEndGame() {
    this.observer?.emit(false);
  }

}
