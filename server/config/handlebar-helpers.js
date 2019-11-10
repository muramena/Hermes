module.exports = {
  switch: function (value, options) {
    this.switch_value = value;
    return options.fn(this);
  },
  case: function (value, options) {
    if (value == this.switch_value) {
      return options.fn(this);
    }
  },
  ifEquals: function(a, b, options) {
    if (a === b) {
      return options.fn(this);
    }

    return options.inverse(this);
  }
}
