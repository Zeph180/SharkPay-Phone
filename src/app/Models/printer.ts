import { registerPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';

export interface PrinterPlugin {
  // Basic functionality
  echo(options: { value: string }): Promise<{ value: string }>;

  // Printer methods
  discoverBluetoothPrinters(): Promise<{ devices: BluetoothDevice[] }>;
  connectBluetoothPrinter(options: { macAddress: string }): Promise<void>;
  printText(options: { text: string }): Promise<void>;
  disconnectPrinter(): Promise<void>;

  // Permissions
  checkPermissions(): Promise<PermissionStatus>;
  requestPermissions(): Promise<PermissionStatus>;

  // Events
  addListener(
    eventName: 'bluetoothDeviceFound',
    listenerFunc: (event: { device: BluetoothDevice }) => void,
  ): PluginListenerHandle;
}

export interface BluetoothDevice {
  name: string | null;
  address: string;
}

export interface PermissionStatus {
  bluetoothScan?: boolean;
  bluetoothConnect?: boolean;
  location: boolean;
}

const Printer = registerPlugin<PrinterPlugin>('Printer');

export { Printer };
