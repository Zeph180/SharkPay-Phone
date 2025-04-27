// src/app/components/printer-control/printer-control.component.ts
import { Component, OnInit } from '@angular/core';
import { PrinterService } from '../../services/printer.service';

@Component({
  selector: 'app-printer-control',
  templateUrl: './printer-control.component.html',
  styleUrls: ['./printer-control.component.scss'],
})
export class PrinterControlComponent implements OnInit {
  printers: any[] = [];
  selectedPrinter: any = null;
  isDiscovering = false;
  isConnected = false;

  constructor(private printerService: PrinterService) {}

  ngOnInit() {
    this.checkConnection();
  }

  async discoverPrinters() {
    this.isDiscovering = true;
    try {
      this.printers = await this.printerService.discoverPrinters();
    } finally {
      this.isDiscovering = false;
    }
  }

  async connectPrinter() {
    if (!this.selectedPrinter) return;

    this.isConnected = await this.printerService.connectPrinter(this.selectedPrinter.address);
  }

  async checkConnection() {
    // You might want to implement a way to check existing connection
    this.isConnected = false; // Placeholder
  }

  printerChanged(event: any) {
    this.selectedPrinter = event.detail.value;
  }
}
