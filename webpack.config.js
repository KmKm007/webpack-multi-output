const HtmlWebpackPlugin = require('html-webpack-plugin')

var glob = require('glob');

var path = require('path')

var webpackConfig = {
    /* 一些webpack基础配置 */
    entry: {},
    plugins: [],
    output: {
      path: path.join(__dirname, 'output'),
      filename: '[name]/main.js',
      chunkFilename: '[name].js'
    },
    module: {
      rules: [{
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          }
        ]
      }]
    }
};

// 获取指定路径下的入口文件
function getEntries(globPath) {
     var files = glob.sync(globPath),
       entries = {};

     files.forEach(function(filepath) {
         // 取倒数第二层(view下面的文件夹)做包名
         var split = filepath.split('/');
         var name = split[split.length - 2];

         entries[name] = './' + filepath;
     });

     return entries;
}

var entries = getEntries('src/views/**/index.js');

Object.keys(entries).forEach(function(name) {
    // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
    webpackConfig.entry[name] = entries[name];

    // 每个页面生成一个html
    var plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: name + '/' + 'index.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: './template.html',
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: [name]
    });
    webpackConfig.plugins.push(plugin);
})

module.exports = webpackConfig
