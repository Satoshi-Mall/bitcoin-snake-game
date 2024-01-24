import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LightingNetworkProviderService } from '../services/lighting-network-provider.service';
import Invoice from '../classes/lightingNetwork/Invoice';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { PlayerProviderService } from '../services/player-provider.service';
import { FormsModule } from '@angular/forms';
import LNURLScanResult from '../classes/lightingNetwork/LNURLScanResult';
import { GamePlayProviderService } from '../services/game-play-provider.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy{
  invoiceQRCodeUrl: any = null;
  invoice: Invoice | undefined;
  invoicePaid: boolean = false;
  invoiceCheckerSubscription: Subscription;
  playerLNAddress: string | undefined;
  depositAmount = 50;

  constructor(private router: Router, private lnProvider:LightingNetworkProviderService, private playerProvider: PlayerProviderService, private gameplayProvider: GamePlayProviderService){
    this.lnProvider.generateDepositInvoice(this.depositAmount).subscribe(invoice =>{
      this.invoiceQRCodeUrl = this.lnProvider.getInvoiceQRCodeUrl(invoice.payment_request);
      this.invoice = invoice;
      this.gameplayProvider.invoice = invoice;
    });

    const interval$ = interval(1000);

    this.invoiceCheckerSubscription = interval$.subscribe(tick => {
      if(this.invoice){
        this.lnProvider.checkInvoice(this.invoice.payment_hash).subscribe(checkResult => {
          this.invoicePaid = checkResult.paid;
          this.gameplayProvider.invoiceIsPaid = this.invoicePaid;
        })
      }
      
    });
  }
  ngOnDestroy(): void {
    this.invoiceCheckerSubscription.unsubscribe();
  }


  startGame(){
    if(this.playerLNAddress == undefined){
      return;
    }
    this.playerProvider.setAddress(this.playerLNAddress);
    this.lnProvider.getLNURLAdressDetails(this.playerLNAddress).subscribe((LNURLDetails: LNURLScanResult) => {
      this.playerProvider.setLNAddressData(LNURLDetails);
      this.router.navigate(['play']);
    });
  }




}
