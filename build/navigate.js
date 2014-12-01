"use strict";
Object.defineProperties(exports, {
  getDefinitionAtPosition: {get: function() {
      return getDefinitionAtPosition;
    }},
  getReferencesAtPosition: {get: function() {
      return getReferencesAtPosition;
    }},
  getNextReference: {get: function() {
      return getNextReference;
    }},
  __esModule: {value: true}
});
var $__util__,
    $__cache__,
    $__search__;
var $__0 = ($__util__ = require("./util"), $__util__ && $__util__.__esModule && $__util__ || {default: $__util__}),
    positionIsInsideLocation = $__0.positionIsInsideLocation,
    compareIdentifierLocations = $__0.compareIdentifierLocations;
var parseBuffer = ($__cache__ = require("./cache"), $__cache__ && $__cache__.__esModule && $__cache__ || {default: $__cache__}).parseBuffer;
var findSymbolDefinition = ($__search__ = require("./search"), $__search__ && $__search__.__esModule && $__search__ || {default: $__search__}).findSymbolDefinition;
function getDefinitionAtPosition(buffer, path, position) {
  var result = {
    import: null,
    definition: null,
    relativePosition: null,
    globalScope: null
  };
  var $__7 = getReferencesAtPosition(buffer, path, position, {
    includeImports: true,
    relativePosition: true
  }),
      id = $__7.id,
      scope = $__7.scope,
      globalScope = $__7.globalScope,
      imports = $__7.imports,
      relativePosition = $__7.relativePosition;
  result.globalScope = globalScope;
  if (id && scope) {
    result.relativePosition = relativePosition;
    for (var $__3 = imports[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__4; !($__4 = $__3.next()).done; ) {
      var symbol = $__4.value;
      {
        if (symbol.localName == id.name)
          result.import = symbol;
      }
    }
    if (id.property && id.object) {
      result.definition = findSymbolDefinition(id.property, path, id.object, true, scope);
    } else {
      result.definition = findSymbolDefinition(id.name, path, null, true, scope);
    }
  } else if (globalScope) {
    for (var $__5 = globalScope.exportedSymbols[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__6; !($__6 = $__5.next()).done; ) {
      var symbol$__8 = $__6.value;
      {
        if (symbol$__8.importLocation && positionIsInsideLocation(position, symbol$__8.importLocation)) {
          if (symbol$__8.moduleRequest)
            result.definition = findSymbolDefinition(symbol$__8.importName, symbol$__8.moduleRequest, null, false, scope);
        }
      }
    }
  }
  return result;
}
function getReferencesAtPosition(buffer, path, position) {
  var params = arguments[3] !== (void 0) ? arguments[3] : {};
  var scopes = parseBuffer(buffer, path);
  if (scopes) {
    for (var $__3 = scopes[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__4; !($__4 = $__3.next()).done; ) {
      var scope = $__4.value;
      {
        var references = getReferencesAtPositionInScope(scope, position, params);
        if (references.id && references.references) {
          references.scope = scope;
          references.globalScope = scopes[0];
          return references;
        }
      }
    }
  }
  var globalScope = scopes ? scopes[0] : null;
  return {
    id: null,
    references: null,
    scope: null,
    relativePosition: null,
    imports: null,
    globalScope: globalScope
  };
}
function getReferencesAtPositionInScope(scope, position) {
  var params = arguments[2] !== (void 0) ? arguments[2] : {};
  var results = {
    id: null,
    references: null,
    imports: null,
    definitions: null,
    relativePosition: null
  };
  var identifiers = scope.referencedSymbols;
  var imports = scope.importedSymbols;
  var defines = scope.definedSymbols;
  var id = identifiers.filter((function(node) {
    return positionIsInsideLocation(position, node.loc);
  }))[0];
  if (id) {
    results.id = id;
    var isIdName = (function(node) {
      return node.name == id.name;
    });
    var isIdLocalName = (function(node) {
      return node.localName == id.name;
    });
    results.references = identifiers.filter(isIdName).sort(compareIdentifierLocations);
    if (params.includeImports)
      results.imports = imports.filter(isIdLocalName);
    if (params.includeDefinitions)
      results.definitions = defines.filter(isIdLocalName);
    if (params.relativePosition)
      results.relativePosition = position.column - id.loc.start.column;
  }
  return results;
}
function getNextReference(id, references) {
  var skip = arguments[2] !== (void 0) ? arguments[2] : 1;
  var index = references.indexOf(id);
  if (index >= 0)
    return references[(index + references.length + skip) % references.length];
  return null;
}
