const errors = require('./errors.json');

class ErrorManager {
  constructor(language) {
    this.errors = errors;
    this.language = language;
  }

  getErrorText(errorName, parameters) {
    if (!this.errors.hasOwnProperty(errorName)) {
      return 'Error not found.';
    }

    const error = this.errors[errorName];
    let errorMessage = '';

    if (this.language === 'english') {
      errorMessage = error.english;
    } else if (this.language === 'persian') {
      errorMessage = error.persian;
    } else {
      return 'Unsupported language.';
    }

    if (parameters) {
      for (const param in parameters) {
        if (parameters.hasOwnProperty(param)) {
          errorMessage = errorMessage.replace(`#${param}#`, parameters[param]);
        }
      }
    }

    return errorMessage;
  }
}

module.exports = ErrorManager;
