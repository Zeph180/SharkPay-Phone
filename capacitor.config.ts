import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'quickAgent',
  webDir: 'www',
  plugins: {
    nexgosdk: {
      // Add plugin-specific configurations if required
    },
    LocalNetwork: {
      "cleartextTrafficPermitted": true
    }
  }
};

export default config;
