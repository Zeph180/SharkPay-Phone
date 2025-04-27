package io.ionic.starter.printer;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.IntentFilter;
import android.os.Build;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.PermissionCallback;
import net.posprinter.IDeviceConnection;
import net.posprinter.POSConnect;
import net.posprinter.POSPrinter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

@CapacitorPlugin(name = "Printer")
public class PrinterPlugin extends Plugin {
  private BluetoothAdapter bluetoothAdapter;
  private final List<BluetoothDevice> discoveredDevices = new ArrayList<>();
  private BroadcastReceiver bluetoothReceiver;
  private IDeviceConnection currentConnection;

  @PluginMethod
  public void discoverBluetoothPrinters(PluginCall call) {
    try {
      checkBluetoothPermissions(call, () -> {
        discoveredDevices.clear();
        setupBluetoothReceiver();

        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (bluetoothAdapter == null) {
          call.reject("Bluetooth not supported on this device");
          return;
        }

        if (!bluetoothAdapter.isEnabled()) {
          call.reject("Bluetooth is not enabled");
          return;
        }

        Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();
        discoveredDevices.addAll(pairedDevices);

        if (bluetoothAdapter.isDiscovering()) {
          bluetoothAdapter.cancelDiscovery();
        }
        bluetoothAdapter.startDiscovery();

        JSObject result = new JSObject();
        result.put("devices", convertDevicesToJson(discoveredDevices));
        call.resolve(result);
      });
    } catch (Exception e) {
      call.reject("Discovery failed: " + e.getMessage());
    }
  }

  @PluginMethod
  public void connectBluetoothPrinter(PluginCall call) {
    try {
      String macAddress = call.getString("macAddress");
      if (macAddress == null || macAddress.isEmpty()) {
        call.reject("MAC address is required");
        return;
      }

      BluetoothDevice device = findDeviceByMac(macAddress);
      if (device == null) {
        call.reject("Device not found");
        return;
      }

      if (currentConnection != null) {
        currentConnection.close();
      }

      currentConnection = POSConnect.createDevice(POSConnect.DEVICE_TYPE_BLUETOOTH);
      currentConnection.connect(device.getAddress(), (code, msg) -> {
        if (code == POSConnect.CONNECT_SUCCESS) {
          call.resolve();
        } else {
          call.reject("Connection failed: " + msg);
        }
      });
    } catch (Exception e) {
      call.reject("Connection error: " + e.getMessage());
    }
  }

  @PluginMethod
  public void printText(PluginCall call) {
    try {
      String text = call.getString("text", "");
      if (currentConnection == null) {
        call.reject("Not connected to any printer");
        return;
      }

      new POSPrinter(currentConnection)
        .initializePrinter()
        .printString(text)
        .cutHalfAndFeed(1);

      call.resolve();
    } catch (Exception e) {
      call.reject("Print failed: " + e.getMessage());
    }
  }

  @PluginMethod
  public void disconnectPrinter(PluginCall call) {
    try {
      if (currentConnection != null) {
        currentConnection.close();
        currentConnection = null;
      }
      call.resolve();
    } catch (Exception e) {
      call.reject("Disconnect failed: " + e.getMessage());
    }
  }

  @PluginMethod
  public void checkPermissions(PluginCall call) {
    JSObject ret = new JSObject();
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      ret.put("bluetoothScan", hasPermission(Manifest.permission.BLUETOOTH_SCAN));
      ret.put("bluetoothConnect", hasPermission(Manifest.permission.BLUETOOTH_CONNECT));
    }
    ret.put("location", hasPermission(Manifest.permission.ACCESS_FINE_LOCATION));
    call.resolve(ret);
  }

  @PluginMethod
  public void requestPermissions(PluginCall call) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      requestPermissionForAlias("bluetooth", call, "bluetoothPermsCallback");
    } else {
      requestPermissionForAlias("location", call, "locationPermCallback");
    }
  }

//  @PermissionCallback
//  private void bluetoothPermsCallback(PluginCall call) {
//    JSObject ret = new JSObject();
//    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
//      ret.put("bluetoothScan", hasPermission(Manifest.permission.BLUETOOTH_SCAN));
//      ret.put("bluetoothConnect", hasPermission(Manifest.permission.BLUETOOTH_CONNECT));
//    }
//    ret.put("location", hasPermission(Manifest.permission.ACCESS_FINE_LOCATION));
//    call.resolve(ret);
//  }
//
//  @PermissionCallback
//  private void locationPermCallback(PluginCall call) {
//    JSObject ret = new JSObject();
//    ret.put("location", hasPermission(Manifest.permission.ACCESS_FINE_LOCATION));
//    call.resolve(ret);
//  }

  @PermissionCallback
  private void bluetoothPermsCallback(PluginCall call) {
    String callId = call.getCallbackId();
    PluginCall originalCall = bridge.getSavedCall(callId);

    if (hasPermission(Manifest.permission.BLUETOOTH_SCAN) &&
      hasPermission(Manifest.permission.BLUETOOTH_CONNECT)) {
      if (originalCall != null) {
        // Execute the original success callback
        Runnable onSuccess = () -> {
          JSObject ret = new JSObject();
          ret.put("bluetoothScan", true);
          ret.put("bluetoothConnect", true);
          originalCall.resolve(ret);
        };
        onSuccess.run();
      }
    } else {
      if (originalCall != null) {
        originalCall.reject("Bluetooth permissions denied");
      }
    }

    if (originalCall != null) {
      bridge.releaseCall(originalCall);
    }
  }

  @PermissionCallback
  private void locationPermCallback(PluginCall call) {
    String callId = call.getCallbackId();
    PluginCall originalCall = bridge.getSavedCall(callId);

    if (hasPermission(Manifest.permission.ACCESS_FINE_LOCATION)) {
      if (originalCall != null) {
        // Execute the original success callback
        Runnable onSuccess = () -> {
          JSObject ret = new JSObject();
          ret.put("location", true);
          originalCall.resolve(ret);
        };
        onSuccess.run();
      }
    } else {
      if (originalCall != null) {
        originalCall.reject("Location permission required for Bluetooth");
      }
    }

    if (originalCall != null) {
      bridge.releaseCall(originalCall);
    }
  }

//  private void checkBluetoothPermissions(PluginCall call, Runnable onSuccess) {
//    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
//      if (hasPermission(Manifest.permission.BLUETOOTH_SCAN) &&
//        hasPermission(Manifest.permission.BLUETOOTH_CONNECT)) {
//        onSuccess.run();
//      } else {
//        requestPermissionForAlias("bluetooth", call, "bluetoothPermsCallback", (granted) -> {
//          if (granted) {
//            onSuccess.run();
//          } else {
//            call.reject("Bluetooth permissions denied");
//          }
//        });
//      }
//    } else {
//      if (hasPermission(Manifest.permission.ACCESS_FINE_LOCATION)) {
//        onSuccess.run();
//      } else {
//        requestPermissionForAlias("location", call, "locationPermCallback", (granted) -> {
//          if (granted) {
//            onSuccess.run();
//          } else {
//            call.reject("Location permission required for Bluetooth");
//          }
//        });
//      }
//    }
//  }
private void checkBluetoothPermissions(PluginCall call, Runnable onSuccess) {
  if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
    if (hasPermission(Manifest.permission.BLUETOOTH_SCAN) &&
      hasPermission(Manifest.permission.BLUETOOTH_CONNECT)) {
      onSuccess.run();
    } else {
      // Save the call with a unique ID
      String callId = call.getCallbackId();
      bridge.saveCall(call);
      requestPermissionForAlias("bluetooth", call, "bluetoothPermsCallback");
    }
  } else {
    if (hasPermission(Manifest.permission.ACCESS_FINE_LOCATION)) {
      onSuccess.run();
    } else {
      // Save the call with a unique ID
      String callId = call.getCallbackId();
      bridge.saveCall(call);
      requestPermissionForAlias("location", call, "locationPermCallback");
    }
  }
}


  private void setupBluetoothReceiver() {
    if (bluetoothReceiver != null) {
      getActivity().unregisterReceiver(bluetoothReceiver);
    }

    bluetoothReceiver = new BroadcastReceiver() {
      public void onReceive(Context context, android.content.Intent intent) {
        String action = intent.getAction();
        if (BluetoothDevice.ACTION_FOUND.equals(action)) {
          BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
          if (device != null && !discoveredDevices.contains(device)) {
            discoveredDevices.add(device);
            notifyDeviceDiscovered(device);
          }
        }
      }
    };

    IntentFilter filter = new IntentFilter(BluetoothDevice.ACTION_FOUND);
    getActivity().registerReceiver(bluetoothReceiver, filter);
  }

  private void notifyDeviceDiscovered(BluetoothDevice device) {
    JSObject deviceObj = new JSObject();
    deviceObj.put("name", device.getName());
    deviceObj.put("address", device.getAddress());

    JSObject ret = new JSObject();
    ret.put("device", deviceObj);
    notifyListeners("bluetoothDeviceFound", ret);
  }

  private BluetoothDevice findDeviceByMac(String macAddress) {
    for (BluetoothDevice device : discoveredDevices) {
      if (macAddress.equals(device.getAddress())) {
        return device;
      }
    }
    return null;
  }

  private JSObject convertDevicesToJson(List<BluetoothDevice> devices) {
    JSObject result = new JSObject();
    for (BluetoothDevice device : devices) {
      JSObject deviceObj = new JSObject();
      deviceObj.put("name", device.getName());
      deviceObj.put("address", device.getAddress());
      result.put(device.getAddress(), deviceObj);
    }
    return result;
  }

  @Override
  public void handleOnDestroy() {
    super.handleOnDestroy();
    if (bluetoothReceiver != null) {
      try {
        getActivity().unregisterReceiver(bluetoothReceiver);
      } catch (Exception e) {
        // Receiver was not registered
      }
    }
    if (currentConnection != null) {
      currentConnection.close();
    }
  }
}
