package io.ionic.starter;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import io.ionic.starter.printer.PrinterPlugin;

//public class MainActivity extends BridgeActivity {
//    @Override
//    public void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        registerPlugin(PrinterPlugin.class);
//    }
//}


import io.ionic.starter.printer.PrinterPlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(PrinterPlugin.class);
  }
}
