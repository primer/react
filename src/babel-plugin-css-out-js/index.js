/* eslint-disable no-console */
/* eslint-disable github/array-foreach */
/**
 * next steps:
 * expand beyond ActionList/Item.tsx
 * expand types supported
 * calculate % of types compiled
 */
import { ensureFileSync, writeFileSync } from 'fs-extra';
import { join, relative } from 'path';
import { default as hash } from '@emotion/hash';
// @ts-ignore, there are no types for this library
import { string as stylesObjectToString } from 'to-style';
var COMPILED_TAG = '__COMPILED__';
var classNamePrefix = 'sx';
// TODO: remove styled-components import if all styles are compiled out
export default function plugin(_a) {
    var types = _a.types;
    var visitor = {
        Program: {
            enter: function (_nodePath, state) {
                var _a;
                // @ts-ignore not typed, dist is relative to root
                var dist = join(state.cwd, state.opts.dist || '');
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                var relativeFilePath = relative(state.cwd, state.filename);
                // TODO: this should be .scss to allow nesting
                var outFilePath = join(dist, relativeFilePath.replace('src/', '').replace('.tsx', '.css'));
                state.set('outFilePath', outFilePath);
                state.set('moduleSpecifier', relativeFilePath);
                state.set('debug', (_a = state.file.opts.filename) === null || _a === void 0 ? void 0 : _a.includes('src/ActionList/Item'));
            },
            exit: function (nodePath, state) {
                if (!state.get('cssInjected'))
                    return;
                // add css file import
                var moduleSpecifier = './Item.css';
                var importDeclaration = types.importDeclaration([], types.stringLiteral(moduleSpecifier));
                nodePath.node.body.unshift(importDeclaration);
            }
        },
        JSXAttribute: function (JSXAttributePath, state) {
            if (state.get('debug') !== true)
                return;
            if (JSXAttributePath.node.name.name !== 'sx')
                return;
            if (!JSXAttributePath.node.value)
                return;
            if (!types.isJSXExpressionContainer(JSXAttributePath.node.value)) {
                console.log('This is invalid usage, needs to be fixed manually');
                printNode(state, JSXAttributePath.node.value);
                return;
            }
            var expression = JSXAttributePath.node.value.expression;
            var styles = {};
            if (types.isObjectExpression(expression)) {
                expression.properties.forEach(function (property) {
                    // property.type with # of instances in primer/react
                    // ObjectProperty 119 | SpreadElement 20 | ObjectMethod 0
                    if (types.isObjectMethod(property) || types.isSpreadElement(property)) {
                        // TODO
                        // example: {...styles} or even sx={{position: 'relative', ...props.sx }}
                        // https://github.com/primer/react/blob/main/src/TextInputWithTokens.tsx#L269
                    }
                    else if (types.isObjectProperty(property)) {
                        // property.key.type (# of instances in primer/react)
                        // Identifier (108) | StringLiteral (7) | ConditionalExpression (2)
                        // (0) Expression | NumericLiteral | BigIntLiteral | DecimalLiteral | PrivateName
                        if (!types.isIdentifier(property.key)) {
                            // TODO
                            // example, ConditionalExpression: sx={{[position === 'end' ? 'marginBottom' : 'marginTop']: 2}}
                            // example, StringLiteral: sx={{'&:hover': {}}}
                            console.log("Can not compile ".concat(property.key.type, " yet."));
                            printNode(state, property);
                            return;
                        }
                        else
                            ; // Identifier, continue
                        // property.value.type (# of instances in primer/react)
                        // StringLiteral (59) | NumericLiteral (21) | Identifier (5) | TemplateLiteral (3) |
                        // ConditionalExpression (9) | MemberExpression (7) | CallExpression (1) | ObjectExpression (3)
                        if (types.isNumericLiteral(property.value) || types.isStringLiteral(property.value)) {
                            styles[property.key.name] = property.value.value;
                            // tag property name as compiled, so it can be removed later
                            property.key = types.identifier(COMPILED_TAG);
                        }
                        else if (types.isIdentifier(property.value) || types.isExpression(property.value)) {
                            // value is set with a variable or expression
                            // example: sx={{flexGrow: props.InlineDescription ? 0 : 1}}
                            var cssVariable = "--".concat(property.key.name);
                            styles[property.key.name] = "var(".concat(cssVariable, ")");
                            // set variable on runtime via style attribute
                            // here
                            var jsxOpeningElement = JSXAttributePath.parent;
                            var styleAttribute = jsxOpeningElement.attributes.find(function (attr) {
                                return types.isJSXAttribute(attr) && attr.name.name === 'style';
                            });
                            if (styleAttribute) {
                                // TODO: add variable into existing styles object
                            }
                            else {
                                // add style attribute
                                var keyVal = types.objectProperty(types.stringLiteral(cssVariable), property.value);
                                jsxOpeningElement.attributes.push(types.jsxAttribute(types.jsxIdentifier('style'), types.jsxExpressionContainer(types.objectExpression([keyVal]))));
                                // tag property name as compiled, so it can be removed later
                                property.key = types.identifier(COMPILED_TAG);
                            }
                        }
                        else {
                            // TODO
                            console.log("Can not compile ".concat(property.value.type, " yet."));
                            printNode(state, property);
                            return;
                        }
                    }
                });
                // Remove compiled properties from properties
                expression.properties = expression.properties.filter(function (property) {
                    if (types.isObjectProperty(property) &&
                        types.isIdentifier(property.key) &&
                        property.key.name === COMPILED_TAG) {
                        return false;
                    }
                    else
                        return true;
                });
                // if expression object is empty now, it's safe to remove it
                if (expression.properties.length === 0)
                    JSXAttributePath.remove();
            }
            else if (types.isExpression(expression)) {
                // external variable sx={styles}
            }
            else if (types.isCallExpression(expression)) {
                // function call like sx={getStyles()} or even sx={merge(styles,props.sx)}
            }
            else {
                // can safely ignore, types narrowed to JSXEmptyExpression | never
            }
            // nothing could be compiled
            if (Object.keys(styles).length === 0)
                return;
            /**
             * Step 2: Write css into outFile
             */
            // TODO: need to interpolate these for theme
            var stringifiedStyles = stylesObjectToString(styles);
            // @ts-ignore TODO: i don't understand
            var uniqueHash = hash["default"](stringifiedStyles);
            /**
             * Step 2.1: Create a good class name
             */
            var parentNode = JSXAttributePath.parent;
            // if available, get component name for prettier classname
            var componentName;
            var componentParent = JSXAttributePath.findParent(function (parent) { return types.isVariableDeclarator(parent); });
            if (componentParent &&
                types.isVariableDeclarator(componentParent.node) &&
                types.isIdentifier(componentParent.node.id)) {
                componentName = componentParent.node.id.name;
            }
            // if available, get data-component
            var dataComponentName = '';
            var dataComponentAttribute = parentNode.attributes.find(function (attribute) {
                return (types.isJSXAttribute(attribute) &&
                    attribute.name.name === 'data-component' &&
                    types.isStringLiteral(attribute.value));
            });
            if (dataComponentAttribute &&
                types.isJSXAttribute(dataComponentAttribute) &&
                types.isStringLiteral(dataComponentAttribute.value)) {
                dataComponentName = dataComponentAttribute.value.value;
            }
            // @ts-ignore expecting parentNode.name to be a JSXIdentifier, not JSXMemberExpression
            var JSXOpeningElementName = parentNode.name.name;
            var className = [classNamePrefix, componentName, JSXOpeningElementName, dataComponentName, uniqueHash]
                .filter(Boolean)
                .map(function (part) { return part.replaceAll('.', '_'); })
                .join('-');
            /**
             * Step 2.2: Write css into file
             */
            var outFilePath = state.get('outFilePath');
            appendCSS({ outFilePath: outFilePath, className: className, stringifiedStyles: stringifiedStyles });
            state.set('cssInjected', true);
            /**
             * Step 2.3: Put generated class name on JSXElement
             */
            // add classname to JSXOpeningElement
            var classNameAttribute = parentNode.attributes.find(function (attribute) {
                if (types.isJSXSpreadAttribute(attribute))
                    return false;
                if (attribute.name.name === 'className')
                    return true;
            });
            if (classNameAttribute) {
                // TODO: if it already exists, add to it
                // JSXAttribute | JSXSpreadAttribute
            }
            else {
                // add className attribute
                parentNode.attributes.push(types.jsxAttribute(types.jsxIdentifier('className'), types.stringLiteral(className)));
            }
        }
    };
    return { name: 'babel-plugin-css-out-js', visitor: visitor };
}
var cssMap = new Map();
var appendCSS = function (_a) {
    var outFilePath = _a.outFilePath, className = _a.className, stringifiedStyles = _a.stringifiedStyles;
    // avoid duplicate classes
    if (cssMap.get(className) === stringifiedStyles)
        return;
    cssMap.set(className, stringifiedStyles);
    var contents = "/* \n  This file is generated by babel-plugin-css-out-js \u2728\n  Don't edit this file directly :)\n*/\n  ";
    cssMap.forEach(function (value, key) {
        contents += "\n.".concat(key, " {\n  ").concat(value, "\n}");
    });
    // flush
    ensureFileSync(outFilePath);
    writeFileSync(outFilePath, contents);
};
// @ts-ignore only debugging
var printNode = function (state, pathNode) {
    if (!pathNode.start) {
        console.log("start + end not found, can print source");
        return;
    }
    console.log(state.file.code.slice(pathNode.start, pathNode.end));
    console.log("".concat(state.file.opts.filename, ":").concat(pathNode.loc.start.line));
    console.log('---');
};
