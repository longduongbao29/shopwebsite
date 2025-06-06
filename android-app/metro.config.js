const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
    const config = await getDefaultConfig(__dirname);
    // Thêm 'cjs' vào danh sách các extension được resolve
    config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];
    return config;
})();
