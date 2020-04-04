const Platform = {
  OS: 'unknown',
  Version: 0,
  select: (obj) => {
    if (hasOwnProperty.call(obj, Platform.OS)) {
      return obj[Platform.OS]
    }
    return obj.default
  },
  inject: (platform) => {
    // Use bracket accessor notation as workaround for
    // https://github.com/facebook/metro-bundler/issues/27
    Platform['OS'] = platform.OS
    Platform['Version'] = platform.Version
  },
}

module.exports = Platform
