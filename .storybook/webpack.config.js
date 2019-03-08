module.exports = ({ config }) => {
  config.module.rules.push(
    {
      test: /\.worker\.[jt]s$/,
      use: [{ loader: 'worker-loader' }],
    },
    {
      test: /\.tsx?$/,
      use: [{ loader: 'ts-loader' }],
    }
  )
  config.output.globalObject = 'this'
  config.resolve.extensions.push('.ts', '.tsx')
  return config
}
