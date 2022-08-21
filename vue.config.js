module.exports = {
  runtimeCompiler: true,

  devServer: {
    proxy: {
      '^/dictionary': {
        target: 'http://localhost:3000/',
        logLevel: 'debug'
      }
    }
  },

  transpileDependencies: ['vuetify']
}
