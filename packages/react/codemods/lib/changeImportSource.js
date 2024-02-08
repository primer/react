function changeImportSource(j, root, options) {
  const { name, from, to } = options;
  // Changes is a mapping of `imported` values to their `local` values. For
  // example, someone may import `Link` but remaps it to `PrimerLink`
  //
  // Example:
  // Map(
  //   'Link' => ['PrimerLink'],
  // )
  const changes = new Map();

  root.find(j.ImportDeclaration, {
    source: {
      value: from,
    },
  }).forEach((path) => {
    // Iterate through every ImportSpecifier that matches the given `name` of
    // the import that we're changing. Add the name of the import to our list of
    // changes and remove the ImportSpecifier
    j(path).find(j.ImportSpecifier, {
      imported: {
        name,
      },
    }).forEach((specifierPath) => {
      const imported = specifierPath.value.imported.name;
      if (!changes.has(imported)) {
        changes.set(imported, []);
      }
      changes.get(imported).push(specifierPath.value.local.name);
      j(specifierPath).remove();
    });

    // If the ImportDeclaration is empty (has no specifiers), remove it
    const specifiers = j(path).find(j.ImportSpecifier);
    if (specifiers.length === 0) {
      j(path).remove();
    }
  });

  if (changes.size === 0) {
    return;
  }

  // If we have no ImportDeclaration's, create one at the top of the file.
  // Note: make sure to preserve leading comments in the transformer that uses
  // this utility function
  if (root.find(j.ImportDeclaration).length === 0) {
    root.find(j.Program).get('body', 0).insertBefore(
      j.importDeclaration(Array.from(changes).flatMap(([imported, locals]) => {
        return locals.map((local) => {
          return j.importSpecifier(j.identifier(imported), j.identifier(local));
        });
      }), j.stringLiteral('@primer/react'))
    );
    return;
  }

  // Look for import declarations that match the given `to` ImportDeclaration
  // source
  const matchingImportDeclarations = root.find(j.ImportDeclaration, {
    source: {
      value: to,
    },
  });

  // If none exist, try to insert the ImportDeclaration for `to` in alphabetical
  // order
  if (matchingImportDeclarations.length === 0) {
    const importDeclarations = root.find(j.ImportDeclaration);
    const order = [
      ...importDeclarations.nodes().map((node) => {
        return node.source.value;
      }),
      to,
    ].sort((a, b) => {
      return a.localeCompare(b);
    });
    const insertionIndex = order.indexOf(to);
    const specifiers = Array.from(changes).flatMap(([imported, locals]) => {
      return locals.map(local => {
        return j.importSpecifier(j.identifier(imported), j.identifier(local));
      });
    });

    if (insertionIndex === 0) {
      importDeclarations.at(0).insertBefore(
        j.importDeclaration(specifiers, j.stringLiteral(to)),
      );
    } else {
      importDeclarations.at(insertionIndex - 1).insertAfter(
        j.importDeclaration(specifiers, j.stringLiteral(to)),
      );
    }

    return;
  }

  // If one exists, try to add the specifier in alphabetical order
  matchingImportDeclarations.at(0).forEach((path) => {
    const specifiers = path.value.specifiers.map((specifier) => {
      return specifier.imported.name;
    });
    const order = [...specifiers, ...Array.from(changes.keys())].sort((a, b) => {
      return a.localeCompare(b);
    });

    for (const [imported, locals] of changes) {
      const insertionIndex = order.indexOf(imported);
      const specifiers = locals.map(local => {
        return j.importSpecifier(j.identifier(imported), j.identifier(local));
      });

      // The `change` should be at the front of the list
      if (insertionIndex === 0) {
        j(path).find(j.ImportSpecifier).at(0).insertBefore(
          specifiers
        );
      } else {
        // The `change` should be after an item in the list
        j(path).find(j.ImportSpecifier).at(insertionIndex - 1).insertAfter(
          specifiers
        );
      }
    }
  });
}

module.exports = {
  changeImportSource,
};
