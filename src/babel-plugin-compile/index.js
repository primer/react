import * as fs from 'fs-extra';
import * as path from 'path';
import hash from '@emotion/hash';
// @ts-ignore, there are no types for this library
import { string as stylesToString } from 'to-style';
var CLASS_COUNT = 0;
export default function (_a) {
    var types = _a.types;
    var visitor = {
        Program: {
            enter: function (nodePath, state) {
                var _a;
                // @ts-ignore not typed, dist is relative to root
                var dist = path.join(state.cwd, state.opts.dist || '');
                var relativeFilePath = path.relative(state.cwd, state.file.opts.filename);
                var outFilePath = path.join(dist, relativeFilePath.replace('src/', 'css/').replace('.tsx', '.css'));
                state.set('outFilePath', outFilePath);
                state.set('debug', (_a = state.file.opts.filename) === null || _a === void 0 ? void 0 : _a.includes('src/ActionList/Item'));
            },
            exit: function (nodePath, state) {
                if (!state.get('cssInjected'))
                    return;
                var moduleSpecifier = state.get('outFilePath');
                var importDeclaration = types.importDeclaration([], types.stringLiteral(moduleSpecifier));
                nodePath.unshiftContainer('body', importDeclaration);
            }
        },
        JSXAttribute: function (path, state) {
            if (state.get('debug') !== true)
                return;
            if (path.node.name.name !== 'sx')
                return;
            if (!path.node.value)
                return;
            if (!types.isJSXExpressionContainer(path.node.value)) {
                console.log('This is invalid usage, needs to be fixed manually');
                printNode(state, path.node.value);
                return;
            }
            var expression = path.node.value.expression;
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
                            // TODO: remove property from object after inserting in styles
                        }
                        else {
                            // TODO
                            // console.log(`Can not compile ${property.value.type} yet.`)
                            // printNode(state, property)
                            return;
                        }
                    }
                });
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
            var stringifiedStyles = stylesToString(styles);
            // Write css into outFile
            var parentNode = path.parent;
            var componentName;
            var functionParent = path.getFunctionParent();
            console.log(functionParent.type);
            console.log(functionParent.parent.type);
            // if (types.isArrowFunctionExpression(functionParent)) componentName = functionParent.parent.id.name
            // else if (types.isFunctionDeclaration(functionParent)) componentName = functionParent.node.id.name
            // @ts-ignore ugh so silly
            var className = 'prc-' + componentName + '-' + parentNode.name.name + '-' + hash["default"](stringifiedStyles);
            var outFilePath = state.get('outFilePath');
            appendCSS({ outFilePath: outFilePath, className: className, stringifiedStyles: stringifiedStyles });
            state.set('cssInjected', true);
            // add classname to JSXOpeningElement
            var classNameAttribute = parentNode.attributes.find(function (attribute) {
                if (types.isJSXSpreadAttribute(attribute))
                    return false;
                if (attribute.name.name === 'className')
                    return true;
            });
            if (classNameAttribute) {
                // if it already exists, add to it
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
    fs.ensureFileSync(outFilePath);
    fs.writeFileSync(outFilePath, contents);
};
// @ts-ignore only debugging
var printNode = function (state, pathNode) {
    console.log(state.file.code.slice(pathNode.start, pathNode.end));
    console.log("".concat(state.file.opts.filename, ":").concat(pathNode.loc.start.line));
    console.log('---');
};
