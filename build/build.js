'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    const hash = config.build.hash

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.cyan('  Link production assets to latest '+ hash + '.\n'))
    
    fs.unlink('./public', err => {
      if (err) {
        console.log(chalk.red('  Removing Symlink failed.\n'))
        process.exit(1)
      }
    })
    fs.symlink('./dist/' + hash, './public' , err => {
      if (err) {
        console.log(chalk.red('  Symlink failed. Possibly already existed\n'))
        process.exit(1)
      }

      console.log(chalk.cyan('  Production assets successfully updated to latest\n'))
    })
  })
})
