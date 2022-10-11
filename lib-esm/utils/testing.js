import React from 'react';
import { promisify } from 'util';
import renderer from 'react-test-renderer';
import enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { render as render$1 } from '@testing-library/react';
import { toHaveNoViolations, axe } from 'jest-axe';
import theme from '../theme-preval.js';
import ThemeProvider from '../ThemeProvider.js';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const readFile = promisify(require('fs').readFile);
const COMPONENT_DISPLAY_NAME_REGEX = /^[A-Z][A-Za-z]+(\.[A-Z][A-Za-z]+)*$/;
enzyme.configure({
  adapter: new Adapter()
});
function mount(component) {
  return enzyme.mount(component);
}

/**
 * Render the component (a React.createElement() or JSX expression)
 * into its intermediate object representation with 'type',
 * 'props', and 'children' keys
 *
 * The returned object can be matched with expect().toEqual(), e.g.
 *
 * ```js
 * expect(render(<Foo />)).toEqual(render(<div foo='bar' />))
 * ```
 */
function render(component, theme$1 = theme) {
  return renderer.create( /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: theme$1
  }, component)).toJSON();
}
/**
 * Render the component (a React.createElement() or JSX expression)
 * using react-test-renderer and return the root node
 * ```
 */

function renderRoot(component) {
  return renderer.create(component).root;
}
/**
 * Get the HTML class names rendered by the component instance
 * as an array.
 *
 * ```js
 * expect(renderClasses(<div className='a b' />))
 *   .toEqual(['a', 'b'])
 * ```
 */

function renderClasses(component) {
  const {
    props: {
      className
    }
  } = render(component);
  return className ? className.trim().split(' ') : [];
}
/**
 * Returns true if a node renders with a single class.
 */

function rendersClass(node, klass) {
  return renderClasses(node).includes(klass);
}
function px(value) {
  return typeof value === 'number' ? `${value}px` : value;
}
function percent(value) {
  return typeof value === 'number' ? `${value}%` : value;
}
function renderStyles(node) {
  const {
    props: {
      className
    }
  } = render(node);
  return getComputedStyles(className);
}
function getComputedStyles(className) {
  const div = document.createElement('div');
  div.className = className;
  const computed = {};

  for (const sheet of document.styleSheets) {
    // CSSRulesLists assumes every rule is a CSSRule, not a CSSStyleRule
    for (const rule of sheet.cssRules) {
      if (rule instanceof CSSMediaRule) {
        readMedia(rule);
      } else if (rule instanceof CSSStyleRule) {
        readRule(rule, computed);
      } else ;
    }
  }

  return computed;

  function matchesSafe(node, selector) {
    if (!selector) {
      return false;
    }

    try {
      return node.matches(selector);
    } catch (error) {
      return false;
    }
  }

  function readRule(rule, dest) {
    if (matchesSafe(div, rule.selectorText)) {
      const {
        style
      } = rule;

      for (let i = 0; i < style.length; i++) {
        const prop = style[i];
        dest[prop] = style.getPropertyValue(prop);
      }
    }
  }

  function readMedia(mediaRule) {
    const key = `@media ${mediaRule.media[0]}`; // const dest = computed[key] || (computed[key] = {})

    const dest = {};

    for (const rule of mediaRule.cssRules) {
      if (rule instanceof CSSStyleRule) {
        readRule(rule, dest);
      }
    } // Don't add media rule to computed styles
    // if no styles were actually applied


    if (Object.keys(dest).length > 0) {
      computed[key] = dest;
    }
  }
}
/**
 * This provides a layer of compatibility between the render() function from
 * react-test-renderer and Enzyme's mount()
 */

function getProps(node) {
  return typeof node.props === 'function' ? node.props() : node.props;
}
function getClassName(node) {
  return getProps(node).className;
}
function getClasses(node) {
  const className = getClassName(node);
  return className ? className.trim().split(/ +/) : [];
}
async function loadCSS(path) {
  const css = await readFile(require.resolve(path), 'utf8');
  const style = document.createElement('style');
  style.setAttribute('data-path', path);
  style.textContent = css;
  document.head.appendChild(style);
  return style;
}
function unloadCSS(path) {
  const style = document.querySelector(`style[data-path="${path}"]`);

  if (style) {
    style.remove();
    return true;
  }
} // If a component requires certain props or other conditions in order
// to render without errors, you can pass a `toRender` function that
// returns an element ready to be rendered.

function behavesAsComponent({
  Component,
  toRender,
  options
}) {
  options = options || {};

  const getElement = () => toRender ? toRender() : /*#__PURE__*/React.createElement(Component, null);

  if (!options.skipSx) {
    it('implements sx prop behavior', () => {
      expect(getElement()).toImplementSxBehavior();
    });
  }

  if (!options.skipAs) {
    it('respects the as prop', () => {
      const As = /*#__PURE__*/React.forwardRef((_props, ref) => /*#__PURE__*/React.createElement("div", {
        className: "as-component",
        ref: ref
      }));
      const elem = /*#__PURE__*/React.cloneElement(getElement(), {
        as: As
      });
      expect(render(elem)).toEqual(render( /*#__PURE__*/React.createElement(As, null)));
    });
  }

  it('sets a valid displayName', () => {
    expect(Component.displayName).toMatch(COMPONENT_DISPLAY_NAME_REGEX);
  });
  it('renders consistently', () => {
    expect(render(getElement())).toMatchSnapshot();
  });
} // eslint-disable-next-line @typescript-eslint/no-explicit-any

function checkExports(path, exports) {
  it('has declared exports', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(`../${path}`);

    expect(mod).toSetExports(exports);
  });
}
expect.extend(toHaveNoViolations);
function checkStoriesForAxeViolations(name, storyDir) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const stories = require(`${storyDir || '../stories/'}${name}.stories`); // eslint-disable-next-line @typescript-eslint/no-unused-vars -- _meta


  const {
    default: _meta,
    ...Stories
  } = stories;
  Object.values(Stories).map(Story => {
    if (typeof Story !== 'function') return;
    const {
      storyName,
      name: StoryFunctionName
    } = Story;
    it(`story ${storyName || StoryFunctionName} should have no axe violations`, async () => {
      const {
        container
      } = render$1( /*#__PURE__*/React.createElement(Story, null));
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
}

export { COMPONENT_DISPLAY_NAME_REGEX, behavesAsComponent, checkExports, checkStoriesForAxeViolations, getClassName, getClasses, getComputedStyles, getProps, loadCSS, mount, percent, px, render, renderClasses, renderRoot, renderStyles, rendersClass, unloadCSS };
