// sloppy but useful logger thingymabob
function Logger(loggingLevel, writeStream) {
  this.levels = ['ALL', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF']
  this.level = (logLevel) => {
    if (this.levels.includes(logLevel))
      return logLevel
    else
      return this.levels[logLevel] || this.levels[0]
  }
  this.levelIndex = (level) => {
    const i = Number.isInteger(level) ? level : this.levels.indexOf(level)
    return Math.max(i, 0)
  }
  this.logLevel = this.levelIndex(loggingLevel)
  this.writeStream = writeStream || process.stdout
  this.log = (message, level) => {
    const l = this.levelIndex(level)
    if (l < this.logLevel)
      return
    else
      return this.writeStream.write(
        `${new Date().toISOString()} | ${this.level(l)} | ${message}\n`
      )
  }
}

module.exports = Logger
