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
    { key: 'Turtle', text: 'Turtle', value: 'Turtle', },
    { key: 'N-Triples', text: 'N-Triples', value: 'N-Triples', },
    { key: 'JSON-LD', text: 'JSON-LD', value: 'JSON-LD', },
    { key: 'RDF/XML', text: 'RDF/XML', value: 'RDF/XML', },
    { key: 'TriG', text: 'TriG', value: 'TriG', },
    { key: 'N-Quads', text: 'N-Quads', value: 'N-Quads', },
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
