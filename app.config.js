import * as dotenv from "dotenv";

dotenv.config();

module.exports = {
  expo: {
    name: "ignitefleet",
    slug: "ignitefleet",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#202024",
    },
    ios: {
      supportsTablet: true,
      googleServicesFile: "./GoogleService-Info.plist",
      bundleIdentifier: "com.felipefaustini.ignitefleet",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#202024",
      },
      edgeToEdgeEnabled: true,
      package: "com.felipefaustini.ignitefleet",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to use your location.",
        },
      ],
    ],
  },
};
