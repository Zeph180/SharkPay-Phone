package io.ionic.starter;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import com.nexgo.oaf.apiv3.APIProxy;
import com.nexgo.oaf.apiv3.DeviceEngine;
import com.nexgo.oaf.apiv3.SdkResult;
import com.nexgo.oaf.apiv3.device.beeper.Beeper;


import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Get the global object for device operations
        DeviceEngine deviceEngine = APIProxy.getDeviceEngine(this);

        // Example: Get the beeper object and ring for 500 milliseconds
//        Beeper beeper = deviceEngine.getBeeper();
//        beeper.beep(500);
    }
}

