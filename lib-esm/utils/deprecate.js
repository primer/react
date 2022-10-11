import 'react';

const noop = () => {}; // eslint-disable-next-line import/no-mutable-exports


let deprecate = noop;

let useDeprecation = null;

{
  useDeprecation = () => {
    return noop;
  };
}
class Deprecations {
  static instance = null;

  static get() {
    if (!Deprecations.instance) {
      Deprecations.instance = new Deprecations();
    }

    return Deprecations.instance;
  }

  constructor() {
    this.deprecations = [];
  }

  static deprecate({
    name,
    message,
    version
  }) {
    const msg = `WARNING! ${name} is deprecated and will be removed in version ${version}. ${message}`; // eslint-disable-next-line no-console

    console.warn(msg);
    this.get().deprecations.push({
      name,
      message,
      version
    });
  }

  static getDeprecations() {
    return this.get().deprecations;
  }

  static clearDeprecations() {
    this.get().deprecations.length = 0;
  }

}

export { Deprecations, deprecate, useDeprecation };
