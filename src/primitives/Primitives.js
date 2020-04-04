// react-primitives port from https://github.com/lelandrichardson/react-primitives
//   (don't want to use react-native-web for web)
const Platform = require('./modules/Platform')

const Primitives = {
  StyleSheet: null,
  View: null,
  Text: null,
  Image: null,
  Touchable: null,
  Easing: null,
  Animated: null,
  Dimensions: null,
  // PixelRatio: require('./modules/PixelRatio'),
  Platform,
  inject: (api) => {
    if (api.Platform) {
      Primitives.Platform.inject(api.Platform)
    }
  },
}

module.exports = Primitives
