'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  assetsDir: 'static',
  parallel: false,
  publicPath: './',
  outputDir: 'dist',
  productionSourceMap: false,
  lintOnSave:false,
  devServer: {
    // 本地配置
    proxy: {
      '/api': {
        target: "http://47.94.7.19:8080",
        // target: "https://47.94.7.19:8080",
        changeOrigin: true, // 允许跨域
        pathRewrite: { 
          '^/api': '',
        }
      },
    }
  },
  // devServer: {
  //   port: 8888,
  //   open: true,
  // },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  
}
