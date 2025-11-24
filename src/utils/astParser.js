import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

export const extractVariables = (code) => {
    const variables = new Set();

    try {
        // Parse the code into an AST
        const ast = acorn.parse(code, { ecmaVersion: 2020 });

        // Walk the tree to find member expressions like p.variables.x
        walk.simple(ast, {
            MemberExpression(node) {
                // Check if we are accessing 'p.variables'
                if (
                    node.object.type === 'MemberExpression' &&
                    node.object.object.name === 'p' &&
                    node.object.property.name === 'variables'
                ) {
                    // Add the property name (e.g., 'size') to our set
                    variables.add(node.property.name);
                }
            }
        });
    } catch (e) {
        // Syntax errors are expected while typing; ignore them silently
    }

    return Array.from(variables);
};
