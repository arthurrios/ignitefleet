import * as dotenv from 'dotenv'

dotenv.config()

module.exports = {
  expo: {
    name: 'ignitefleet',
    slug: 'ignitefleet',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#202024',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.arthurrios.ignitefleet',
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              'com.googleusercontent.apps.962379371808-fc8bd46n7tqir4fvjjik6vu8l7e449j6',
            ],
          },
        ],
      },
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#202024',
      },
      package: 'com.arthurrios.ignitefleet',
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-font',
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme:
            'com.googleusercontent.apps.962379371808-fc8bd46n7tqir4fvjjik6vu8l7e449j6',
        },
      ],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow $(PRODUCT_NAME) to use your location.',
        },
      ],
    ],
  },
}
