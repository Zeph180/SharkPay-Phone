package io.ionic.starter;

import com.nexgo.smartpos.sdk.APIProxy;
import com.nexgo.smartpos.sdk.DeviceEngine;
import com.nexgo.smartpos.sdk.module.beeper.Beeper;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Get the global object for device operations
        DeviceEngine deviceEngine = APIProxy.getDeviceEngine(this);

        // Example: Get the beeper object and ring for 500 milliseconds
        Beeper beeper = deviceEngine.getBeeper();
        beeper.beep(500);
    }
}

