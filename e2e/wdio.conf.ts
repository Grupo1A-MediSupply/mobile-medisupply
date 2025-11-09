import path from 'path';
import type { Config } from '@wdio/types';

const platform = (process.env.E2E_PLATFORM || 'android').toLowerCase();
const isAndroid = platform === 'android';

const defaultAndroidAppPath = path.resolve(
  __dirname,
  '../android/app/build/outputs/apk/debug/app-debug.apk'
);

const defaultIosAppPath = path.resolve(
  __dirname,
  '../ios/build/mobile-medisupply/Build/Products/Debug-iphonesimulator/mobile-medisupply.app'
);

export const config: Config = {
  runner: 'local',
  maxInstances: 1,
  specs: ['./e2e/specs/**/*.e2e.ts'],
  logLevel: process.env.WDIO_LOG_LEVEL || 'info',
  bail: 0,
  baseUrl: '',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 1,

  hostname: process.env.APPIUM_HOST || 'localhost',
  port: Number(process.env.APPIUM_PORT || 4723),
  path: process.env.APPIUM_PATH || '/',

  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: Number(process.env.MOCHA_TIMEOUT || 120000),
  },

  autoCompileOpts: {
    tsNodeOpts: {
      project: path.resolve(__dirname, '../tsconfig.json'),
      transpileOnly: true,
    },
  },

  capabilities: isAndroid
    ? [
        {
          platformName: 'Android',
          'appium:automationName': 'UiAutomator2',
          'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
          'appium:app':
            process.env.ANDROID_APP_PATH || defaultAndroidAppPath,
          'appium:autoGrantPermissions': true,
          'appium:newCommandTimeout': 120,
        },
      ]
    : [
        {
          platformName: 'iOS',
          'appium:automationName': 'XCUITest',
          'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone 15',
          'appium:platformVersion': process.env.IOS_PLATFORM_VERSION || '18.0',
          'appium:app':
            process.env.IOS_APP_PATH || defaultIosAppPath,
          'appium:newCommandTimeout': 120,
          'appium:autoAcceptAlerts': true,
        },
      ],

  before: () => {
    const { setOptions } = require('expect-webdriverio');
    setOptions({ wait: 10000 });
  },
};

