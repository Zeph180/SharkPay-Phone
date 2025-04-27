import { registerPlugin } from '@capacitor/core';
import { PluginListenerHandle } from '@capacitor/core';

export interface PrinterPlugin {
  /**
   * Discover available Bluetooth printers
   */
  discoverBluetoothPrinters(): Promise<{ devices: { [address: string]: BluetoothDevice } }>;

  /**
   * Connect to a Bluetooth printer
   */
  connectBluetoothPrinter(options: { macAddress: string }): Promise<void>;

  /**
   * Print text
   */
  printText(options: { text: string }): Promise<void>;

  /**
   * Disconnect current printer
   */
  disconnectPrinter(): Promise<void>;

  /**
   * Listen for newly discovered Bluetooth devices
   */
  addListener(
    eventName: 'bluetoothDeviceFound',
    listenerFunc: (device: { device: BluetoothDevice }) => void,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  requestPermissions(): Promise<{
    bluetoothScan?: boolean;
    bluetoothConnect?: boolean;
    location: boolean;
  }>;
}

export interface BluetoothDevice {
  name: string | null;
  address: string;
}

const Printer = registerPlugin<PrinterPlugin>('Printer');
export { Printer };
