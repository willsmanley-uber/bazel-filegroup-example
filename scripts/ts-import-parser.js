const Parser = require('tree-sitter');
const TypeScript = require('tree-sitter-typescript');
const fs = require('fs');

const isImportStatementNode = (node, sourceCode) => {
  return node.type === 'import_statement';
};

const getImportSourceFromImportStatementNode = (importStatementNode, sourceCode, isVerbose) => {
  // string node is the one and only node type that specifies the import source in an import statement
  const sourceNode = importStatementNode.children.find((child) => child.type === 'string');
  if (isVerbose) verboseLogNode(sourceCode, sourceNode, 'string');
  const sourceStringWithQuotes = getSlice(
    sourceCode,
    sourceNode.startPosition,
    sourceNode.endPosition
  );
  // strip `"path"` into `path`
  return sourceStringWithQuotes.slice(1, sourceStringWithQuotes.length - 1);
};

const isRequireStatementNode = (node, sourceCode) => {
  // LexicalDeclarationNode -> VariableDeclaratorNode -> CallExpressionNode -> IdentifierNode
  if (node.type !== 'lexical_declaration') return false;
  const declarator = node.children.find((child) => child.type === 'variable_declarator');
  if (!declarator) return false;
  const callExpressionNode = declarator.children.find((child) => child.type === 'call_expression');
  if (!callExpressionNode) return false;

  return callExpressionNode.children.some(
    (child) =>
      child.type === 'identifier' &&
      'require' === getSlice(sourceCode, child.startPosition, child.endPosition)
  );
};

const getRequirePathFromRequireStatementNode = (requireStatementNode, sourceCode, isVerbose) => {
  // TODO: explore deliberately confusing usages like `const [path, fs] = [require('path'), require('fs')]`
  // LexicalDeclarationNode -> VariableDeclaratorNode -> CallExpressionNode -> ArgumentsNode
  const declarator = requireStatementNode.children.find(
    (child) => child.type === 'variable_declarator'
  );
  const callExpressionNode = declarator.children.find((child) => child.type === 'call_expression');
  const argumentsNode = callExpressionNode.children.find((child) => child.type === 'arguments');
  const sourceStringWithQuotesAndParens = getSlice(
    sourceCode,
    argumentsNode.startPosition,
    argumentsNode.endPosition
  );
  // strip `("path")` into `path`
  return sourceStringWithQuotesAndParens.slice(2, sourceStringWithQuotesAndParens.length - 2);
};

const getSliceSameRow = (sourceCode, startPosition, endPosition) => {
  const sourceCodeArray = sourceCode.split('\n');
  return sourceCodeArray[startPosition.row].slice(startPosition.column, endPosition.column);
};

// only works for \n line endings
const getSliceDifferentRow = (sourceCode, startPosition, endPosition) => {
  const sourceCodeArray = sourceCode.split('\n');
  const firstRow = sourceCodeArray[startPosition.row].slice(startPosition.column);
  const lastRow = sourceCodeArray[endPosition.row].slice(0, endPosition.column);
  let middleRows = '';
  for (let row = firstRow + 1; row <= lastRow; row++) {
    middleRows += sourceCodeArray[row];
    middleRows += '\n';
  }
  return firstRow + '\n' + middleRows + lastRow;
};

const getSlice = (sourceCode, startPosition, endPosition) => {
  if (startPosition.row === endPosition.row) {
    return getSliceSameRow(sourceCode, startPosition, endPosition);
  } else {
    return getSliceDifferentRow(sourceCode, startPosition, endPosition);
  }
};

const verboseLogNode = (sourceCode, node, type) => {
  console.log('--- --- --- ---');
  console.log(`${type} statement identified...`);
  console.log(node.toString());
  console.log(node);
  console.log(getSlice(sourceCode, node.startPosition, node.endPosition));
  if (type === 'require')
    console.log('source parsed as: ' + getRequirePathFromRequireStatementNode(node, sourceCode));
  if (type === 'import')
    console.log('source parsed as: ' + getImportSourceFromImportStatementNode(node, sourceCode));
  console.log('--- --- --- ---');
  console.log('');
};

const getImportSourcesFromNode = (node, sourceCode, isVerbose) => {
  let importSources = [];
  const parseNode = (node) => {
    const recurse = () => {
      if (node.children.length) {
        for (const child of node.children) {
          parseNode(child);
        }
      }
    };

    if (isImportStatementNode(node, sourceCode)) {
      if (isVerbose) verboseLogNode(sourceCode, node, 'import');
      importSources.push(getImportSourceFromImportStatementNode(node, sourceCode, isVerbose));
    } else if (isRequireStatementNode(node, sourceCode)) {
      if (isVerbose) verboseLogNode(sourceCode, node, 'require');
      importSources.push(getRequirePathFromRequireStatementNode(node, sourceCode, isVerbose));
    } else {
      recurse();
    }
  };
  parseNode(node);
  return importSources;
};

function TSImportParser() {
  this.parser = new Parser();
  this.parser.setLanguage(TypeScript.tsx);
  this.verbose = false;

  this.getImportSourcesFromFile = async function (path) {
    const sourceCode = fs.readFileSync(path, 'utf-8');
    return this.getImportSourcesFromString(sourceCode);
  };

  this.getImportSourcesFromString = function (sourceCode) {
    if (this.verbose) console.log({ sourceCode });
    const tree = this.parser.parse(sourceCode);
    return getImportSourcesFromNode(tree.rootNode, sourceCode, this.verbose);
  };
}

module.exports = TSImportParser;
