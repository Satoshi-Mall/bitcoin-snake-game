import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import LNURLScanResult from '../classes/lightingNetwork/LNURLScanResult';
import LNURLPaymentRequest from '../classes/lightingNetwork/LNURLPaymentRequest';
import Invoice from '../classes/lightingNetwork/Invoice';
import PaymentStatus from '../classes/lightingNetwork/PaymentStatus';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LightingNetworkProviderService {

  baseUrl: string;
  authHeader: HttpHeaders | { [header: string]: string | string[]; } | undefined;

  constructor(private http: HttpClient) {
    this.baseUrl = `http://100.92.21.29:3007`;
    this.authHeader = { "X-API-KEY": "d42afac81d21466896f8aea9fd8075ff" }
  }

  generateDepositInvoice(amount: number = 30): Observable<Invoice> {
    const data = {
      "unit": "sat",
      "internal": false,
      "out": false,
      "amount": amount,
      "memo": "Snake Game Deposit"
    }
    return this.http.post<Invoice>(`${this.baseUrl}/api/v1/payments`, data,
      {
        headers: {
          ...this.authHeader
        }
      });
  }

  checkInvoice(paymentHash: string) {
    return this.http.get<PaymentStatus>(`${this.baseUrl}/api/v1/payments/${encodeURI(paymentHash)}`);
  }

  getInvoiceQRCodeUrl(paymentRequest: string): any {
    return `${this.baseUrl}/api/v1/qrcode/${encodeURI(paymentRequest)}`
  }

  getLNURLAdressDetails(address: string): Observable<LNURLScanResult> {
    return this.http.get<LNURLScanResult>(`${this.baseUrl}/api/v1/lnurlscan/${encodeURI(address)}`, {
      headers: {
        ...this.authHeader
      }
    });
  }

  payAddress(data: LNURLPaymentRequest) {
    return this.http.post<Invoice>(`${this.baseUrl}/api/v1/payments/lnurl`, data,
      {
        headers: {
          ...this.authHeader
        }
      });
  }

}
