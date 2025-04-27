// src/app/components/print-preview/print-preview.component.ts
import { Component, Input } from '@angular/core';
import { PrinterService } from '../../services/printer.service';

@Component({
  selector: 'app-print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['./print-preview.component.scss'],
})
export class PrintPreviewComponent {
  @Input() content: string = '';
  @Input() order: any;

  constructor(private printerService: PrinterService) {}

  async print() {
    try {
      if (this.order) {
        await this.printerService.printReceipt(this.order);
      } else {
        await this.printerService.print(this.content);
      }
    } catch (error) {
      console.error('Print error:', error);
    }
  }
}
