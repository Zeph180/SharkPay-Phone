package io.ionic.starter;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import io.ionic.starter.printer.PrinterPlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Register the Printer plugin
    registerPlugin(PrinterPlugin.class);

    // If you have other plugins, register them here too
    // registerPlugin(OtherPlugin.class);
  }
}
