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
    { type: "Turtle", text: "Turtle", value: "Turtle", types: [ "application/x-turtle", "text/turtle" ], },
    { type: "RDF/XML", text: "RDF/XML", value: "RDF/XML", types: [ "application/rdf+xml", "application/xml", "text/xml" ], },
    { type: "N-Triples", text: "N-Triples", value: "N-Triples", types: [ "application/n-triples", "text/plain" ], },
    { type: "TriG", text: "TriG", value: "TriG", types: ["application/trig", "application/x-trig" ], },
    { type: "Turtle*", text: "Turtle*", value: "Turtle*", types: ["application/x-turtlestar", "text/x-turtlestar" ], },
    { type: "TriG*", text: "TriG*", value: "TriG*", types: ["application/x-trigstar" ], },
    { type: "N-Quads", text: "N-Quads", value: "N-Quads", types: [ "application/n-quads", "text/x-nquads", "text/nquads" ], },
    { type: "JSON-LD", text: "JSON-LD", value: "JSON-LD", types: [ "application/ld+json" ], },
    // { type: "N3", text: "N3", value: "N3", types: ["text/n3", "text/rdf+n3" ], },
    // { type: "TriX", text: "TriX", value: "TriX", types: ["application/trix" ], },
    // { type: "BinaryRDF", text: "BinaryRDF", value: "BinaryRDF", types: ["application/x-binary-rdf" ], },
    // { type: "RDF/JSON", text: "RDF/JSON", value: "RDF/JSON", types: [ "application/rdf+json" ], },
    // { type: "RDFa", text: "RDFa", value: "RDFa", types: ["application/xhtml+xml", "application/html", "text/html" ], },
    // { type: "HDT", text: "HDT", value: "HDT", types: ["application/vnd.hdt" ], },
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
    { key: 'sparql', text: 'SPARQL Query', value: 'sparql', },
]

export const sparqlExamples = [
    {
        key: 'Wikidata',
        text: 'Wikidata',
        value: 'Wikidata',
        url: 'https://query.wikidata.org/sparql?query=',
        query: 'PREFIX sch: <http://schema.org/> CONSTRUCT { ?ctry a sch:Country; sch:identifier ?ctryISOCode ; sch:name ?countryName ; wdt:sharesBorderWith ?otherCountry . } WHERE { ?ctry wdt:P31 wd:Q3624078 ; rdfs:label ?countryName . filter (lang(?countryName) = "en") optional { ?ctry wdt:P297 ?ctryISOCode } optional { ?ctry wdt:P47 ?otherCountry . ?otherCountry wdt:P31 wd:Q3624078 . } } LIMIT 100',
        post: 'https://jbarrasa.com/2019/12/05/quickgraph10-enrich-your-neo4j-knowledge-graph-by-querying-wikidata/',
        setAcceptHeader: false,
    },
    {
        key: 'DBPedia',
        text: 'DBPedia',
        value: 'DBPedia',
        url: 'http://dbpedia.org/sparql?format=text%2Fplain&query=',
        query: 'prefix dbpedia-owl: <http://dbpedia.org/ontology/> CONSTRUCT {  ?movie a dbpedia-owl:Movie ; dbpedia-owl:starring ?hf . ?hf rdfs:label "Harrison Ford"@en . ?movie rdfs:label ?title;  dbpedia-owl:director ?dir . ?dir  a dbpedia-owl:Director; rdfs:label ?dirname . } WHERE {  ?movie dbpedia-owl:starring ?hf .  ?hf rdfs:label "Harrison Ford"@en .  ?movie rdfs:label ?title; dbpedia-owl:director ?dir .  ?dir  rdfs:label ?dirname .  FILTER LANGMATCHES(LANG(?title), "EN")  FILTER LANGMATCHES(LANG(?dirname),  "EN") }',
        // post: 'https://jbarrasa.com/2019/12/05/quickgraph10-enrich-your-neo4j-knowledge-graph-by-querying-wikidata/',
        setAcceptHeader: false,
    },
    {
        key: 'UniProt',
        text: 'UniProt',
        value: 'UniProt',
        url: 'https://sparql.uniprot.org/sparql/?format=ttl&query=',
        query: 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX void:<http://rdfs.org/ns/void#> construct { ?Concept a rdf:Concepto } FROM <https://sparql.uniprot.org/.well-known/void> WHERE {   [] void:class ?Concept . } LIMIT 100',
        // post: 'https://jbarrasa.com/2019/12/05/quickgraph10-enrich-your-neo4j-knowledge-graph-by-querying-wikidata/',
        setAcceptHeader: false,
    },
    {
        key: 'UNESCO',
        text: 'UNESCO Thesaurus',
        value:'UNESCO',
        url: 'http://vocabularies.unesco.org/sparql?format=text%2Fplain&query=',
        query: 'PREFIX skos: <http://www.w3.org/2004/02/skos/core#>  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> construct { ?c a  rdf:Concepto } where {?c a skos:Concept} LIMIT 100',
        // post: 'https://jbarrasa.com/2019/12/05/quickgraph10-enrich-your-neo4j-knowledge-graph-by-querying-wikidata/',
        setAcceptHeader: false,
    },
    {
        key: 'Parliament',
        text: 'Parliament UK',
        value: 'Parliament UK',

        url: 'https://api.parliament.uk/sparql?format=text%2Fplain&query=',
        query: 'PREFIX sch: <http://schema.org/> CONSTRUCT { ?ctry a sch:Country; sch:identifier ?ctryISOCode ; sch:name ?countryName ; wdt:sharesBorderWith ?otherCountry . } WHERE { ?ctry wdt:P31 wd:Q3624078 ; rdfs:label ?countryName . filter (lang(?countryName) = "en") optional { ?ctry wdt:P297 ?ctryISOCode } optional { ?ctry wdt:P47 ?otherCountry . ?otherCountry wdt:P31 wd:Q3624078 . } } LIMIT 100',
        // post: 'https://jbarrasa.com/2019/12/05/quickgraph10-enrich-your-neo4j-knowledge-graph-by-querying-wikidata/',
        setAcceptHeader: false,
    },
    {
        key: 'Microsoft Academic Graph',
        text: 'Microsoft Academic Graph',
        value: 'Microsoft Academic Graph',

        url: 'http://ma-graph.org/sparql?query=',
        setAcceptHeader: true,
        // query: 'PREFIX sch: <http://schema.org/> CONSTRUCT { ?ctry a sch:Country; sch:identifier ?ctryISOCode ; sch:name ?countryName ; wdt:sharesBorderWith ?otherCountry . } WHERE { ?ctry wdt:P31 wd:Q3624078 ; rdfs:label ?countryName . filter (lang(?countryName) = "en") optional { ?ctry wdt:P297 ?ctryISOCode } optional { ?ctry wdt:P47 ?otherCountry . ?otherCountry wdt:P31 wd:Q3624078 . } } LIMIT 100',
        // post: 'https://jbarrasa.com/2019/12/05/quickgraph10-enrich-your-neo4j-knowledge-graph-by-querying-wikidata/',
    },
    {
        key: 'MeSH',
        text: 'MeSH',
        value: 'MeSH',

        url: 'https://id.nlm.nih.gov/mesh/sparql?format=TURTLE&query=',
        // query: 'PREFIX sch: <http://schema.org/> CONSTRUCT { ?ctry a sch:Country; sch:identifier ?ctryISOCode ; sch:name ?countryName ; wdt:sharesBorderWith ?otherCountry . } WHERE { ?ctry wdt:P31 wd:Q3624078 ; rdfs:label ?countryName . filter (lang(?countryName) = "en") optional { ?ctry wdt:P297 ?ctryISOCode } optional { ?ctry wdt:P47 ?otherCountry . ?otherCountry wdt:P31 wd:Q3624078 . } } LIMIT 100',
        // post: 'https://jbarrasa.com/2019/12/05/quickgraph10-enrich-your-neo4j-knowledge-graph-by-querying-wikidata/',
        setAcceptHeader: false,
    },
].sort((a, b) => a.text < b.text ? -1 : 1)