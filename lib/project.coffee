class Project
  constructor: (options) ->
    for name, value of options
      @[name] = value

module.exports = Project
