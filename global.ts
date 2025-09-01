if (!String.prototype.toWellFormed) {
    String.prototype.toWellFormed = function () {
      return this.toString();
    };
  }