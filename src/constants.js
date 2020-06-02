export const handleVocabUriOptions = [
    { key: "SHORTEN", text: "SHORTEN", value: "SHORTEN", },
    { key: "SHORTEN_STRICT", text: "SHORTEN_STRICT", value: "SHORTEN_STRICT", },
    { key: "IGNORE", text: "IGNORE", value: "IGNORE", },
    { key: "MAP", text: "MAP", value: "MAP", },
    { key: "KEEP", text: "KEEP", value: "KEEP", },
]

export const handleMultivalOptions = [
    { key: "OVERWRITE", text: "OVERWRITE", value: "OVERWRITE", },
    { key: "ARRAY", text: "ARRAY", value: "ARRAY", },
]

export const handleRDFTypesOptions = [
    { key: "LABELS", text: "LABELS", value: "LABELS", },
    { key: "NODES", text: "NODES", value: "NODES", },
    { key: "LABELS_AND_NODES", text: "LABELS_AND_NODES", value: "LABELS_AND_NODES", },
]

export const formats = [
    { type: "Turtle", text: "Turtle", value: "Turtle", types: ["text/turtle", "application/x-turtle" ], },
    { type: "RDF/XML", text: "RDF/XML", value: "RDF/XML", types: [ "application/rdf+xml", "application/xml", "text/xml" ], },
    { type: "N-Triples", text: "N-Triples", value: "N-Triples", types: [ "application/n-triples", "text/plain" ], },
    { type: "Turtle*", text: "Turtle*", value: "Turtle*", types: ["text/x-turtlestar", "application/x-turtlestar" ], },
    { type: "N3", text: "N3", value: "N3", types: ["text/n3", "text/rdf+n3" ], },
    { type: "TriX", text: "TriX", value: "TriX", types: ["application/trix" ], },
    { type: "TriG", text: "TriG", value: "TriG", types: ["application/trig", "application/x-trig" ], },
    { type: "TriG*", text: "TriG*", value: "TriG*", types: ["application/x-trigstar" ], },
    { type: "BinaryRDF", text: "BinaryRDF", value: "BinaryRDF", types: ["application/x-binary-rdf" ], },
    { type: "N-Quads", text: "N-Quads", value: "N-Quads", types: [ "application/n-quads", "text/x-nquads", "text/nquads" ], },
    { type: "JSON-LD", text: "JSON-LD", value: "JSON-LD", types: [ "application/ld+json" ], },
    { type: "RDF/JSON", text: "RDF/JSON", value: "RDF/JSON", types: [ "application/rdf+json" ], },
    { type: "RDFa", text: "RDFa", value: "RDFa", types: ["application/xhtml+xml", "application/html", "text/html" ], },
    { type: "HDT", text: "HDT", value: "HDT", types: ["application/vnd.hdt" ], },
]

export const boolean = [
    { key: 'True', text: 'True', value: true, },
    { key: 'False', text: 'False', value: false, },
]

export const url = 'https://raw.githubusercontent.com/jbarrasa/neosemantics/3.5/docs/rdf/nsmntx.ttl'

export const shaclUrl = 'https://raw.githubusercontent.com/neo4j-labs/neosemantics/4.0/src/test/resources/shacl/person2-shacl.ttl'

export const outputFormats = [
    { key: 'stream', text: 'Stream (Table View)', value: 'stream', },
    { key: 'preview', text: 'Preview (Graph View)', value: 'preview', },
]

export const queryTypes = [
    { key: 'local', text: 'Upload', value: 'local', },
    { key: 'inline', text: 'Copy & Paste', value: 'inline', },
    { key: 'fetch', text: 'Fetch from URL', value: 'fetch', },
]
