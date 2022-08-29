module.exports = {
  runtimeCompiler: true,

  devServer: {
    proxy: {
      '^/dictionary': {
        target: 'http://localhost:3000/',
        logLevel: 'debug'
      },
      '^/auth': {
        target: 'http://localhost:3000/',
        logLevel: 'debug'
      },
      '^/config': {
        target: 'http://localhost:3000/',
        logLevel: 'debug'
      }
    }
  },
  publicPath: '/ihrisapp/dictionary/',
  transpileDependencies: ['vuetify']
}
