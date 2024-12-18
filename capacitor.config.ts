import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'SharkPay',
  webDir: 'www',
  plugins: {
    nexgosdk: {
      // Add plugin-specific configurations if required
    },
    LocalNetwork: {
      cleartextTrafficPermitted: true
    },
    CapacitorHttp: {
      enabled: true,
    },
  }
};

export default config;
