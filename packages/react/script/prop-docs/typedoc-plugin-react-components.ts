import * as ts from 'typescript'
import {
  Application,
  Context,
  DeclarationReflection,
  ComponentPath,
  Converter,
  ParameterType,
  ProjectReflection,
} from 'typedoc'

export function getQualifiedName(symbol: ts.Symbol, defaultName: string) {
  // Two implementation options for this one:
  // 1. Use the internal symbol.parent, to walk up until we hit a source file symbol (if in a module)
  //    or undefined (if in a global file)
  // 2. Use checker.getFullyQualifiedName and parse out the name from the returned string.
  // The symbol.parent method is easier to check for now.
  let sym: ts.Symbol | undefined = symbol
  const parts: string[] = []
  while (sym && !sym.declarations?.some(ts.isSourceFile)) {
    parts.unshift(getHumanName(sym.name))
    sym = sym.parent
  }

  return parts.join('.') || defaultName
}

export function getHumanName(name: string) {
  // Unique symbols get a name that will change between runs of the compiler.
  const match = /^__@(.*)@\d+$/.exec(name)
  if (match) {
    return `[${match[1]}]`
  }

  return name
}

// function isTypeJSXElementLike(type: ts.Type, project: TypeScriptProject): boolean {
//   const symbol = type.symbol ?? type.aliasSymbol
//   if (symbol) {
//     const name = project.checker.getFullyQualifiedName(symbol)
//     return (
//       // Remove once global JSX namespace is no longer used by React
//       name === 'global.JSX.Element' ||
//       name === 'React.JSX.Element' ||
//       name === 'React.ReactElement' ||
//       name === 'React.ReactNode'
//     )
//   }

//   if (type.isUnion()) {
//     return type.types.every(
//       // eslint-disable-next-line no-bitwise
//       subType => subType.flags & ts.TypeFlags.Null || isTypeJSXElementLike(subType, project),
//     )
//   }

//   return false
// }

export function load(app: Application) {
  app.converter.on(
    Converter.EVENT_CREATE_DECLARATION,
    (context: Context, refl: DeclarationReflection) => {
      if (!refl.getFullName().includes('UnderlineNav') || refl.getFullName().includes('UnderlineNavItem')) {
        return
      }

      // if (refl.getFullName() !== 'UnderlineNav.propTypes') {
      //   return
      // }

      // console.log(refl.project.getSymbolFromReflection(refl))

      console.log(refl.getFullName(), getQualifiedName(refl.project.getSymbolFromReflection(refl), refl.getFullName()))
      console.log('\n')

      // if (
      //     !refl.kindOf(ReflectionKind.TypeAlias) ||
      //     refl.type?.type !== "reference" ||
      //     refl.type.package !== "zod" ||
      //     (refl.type.qualifiedName !== "TypeOf" &&
      //         refl.type.qualifiedName !== "input")
      // ) {
      //     return;
      // }

      // const originalRef = refl.type.typeArguments?.[0]?.visit({
      //     query: (t) => t.queryType,
      // });

      // const declaration = refl.project
      //     .getSymbolFromReflection(refl)
      //     ?.getDeclarations()
      //     ?.find(ts.isTypeAliasDeclaration);
      // if (!declaration) return;

      // const type = context.getTypeAtLocation(declaration);
      // refl.type = context.converter.convertType(context, type);

      // if (originalRef) {
      //     schemaTypes.set(refl, originalRef);
      // }
    },
    // app.converter.addUnknownSymbolResolver(declaration => {
    //   console.log(declaration.moduleSource)
    // const validSources = [
    //     ...app.options.getValue("additionalModuleSources"),
    //     ...defaultModuleSources,
    // ];
    // const moduleSource = declaration.moduleSource;
    // if (
    //     (moduleSource && validSources.includes(moduleSource)) ||
    //     (!moduleSource && declaration.resolutionStart === "global")
    // ) {
    //     const names = declaration.symbolReference?.path;
    //     if (!names) return;
    //     const dottedName = stringifyPath(names);
    //     const result = resolveName(names);
    //     if (!result && !failed.has(dottedName)) {
    //         failed.add(dottedName);
    //         app.logger.verbose(
    //             `[typedoc-plugin-mdn-links]: Failed to resolve type: ${dottedName}`,
    //         );
    //     }
    //     if (supportsObjectReturn && result) {
    //         return {
    //             target: result,
    //             caption: dottedName,
    //         };
    //     }
    //     return result;
    // }
    // })
  )
}
