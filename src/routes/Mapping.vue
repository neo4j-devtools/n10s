<template>
    <sui-container>
        <h1>Mapping your RDF data to Neo4j</h1>

        <p>Mappings can be used for applying transformations to the RDF as it’s imported into Neo4j or to transform the vocabulary used
            in a Neo4j graph as it’s exported through the different RDF export methods described in <a class="xref" href="https://neo4j.com/docs/labs/nsmntx/current/export/" title="Chapter&nbsp;8.&nbsp;Exporting RDF data" target="_blank">Chapter&nbsp;8, <em>Exporting RDF data</em></a>.
         </p>

         <sui-dropdown
            fluid
            :options="namespaces"
            placeholder="Select Namespace"
            selection
            v-model="namespace"
        />

        <sui-message positive v-if="confirmation" dismissable @dismiss="closeConfirmation">{{ confirmation }}</sui-message>
        <sui-message negative v-if="error" dismissable @dismiss="closeError">{{ error }}</sui-message>

        <sui-list divided relaxed v-if="namespace && namespaceMappings">
            <sui-list-item v-for="mapping in namespaceMappings" :key="mapping.schemaElement">
                <sui-list-icon name="globe" size="large" vertical-align="middle" />
                <sui-list-content>
                    <div class="left floated">
                        <a is="sui-list-header">{{ mapping.schemaElement }}</a>
                        <a is="sui-list-description">{{ mapping.elemName }}</a>
                    </div>

                    <sui-button basic negative size="mini" floated="right" icon="remove" @click.prevent="dropMapping(mapping)">Drop</sui-button>
                </sui-list-content>
            </sui-list-item>
        </sui-list>

        <sui-segment v-if="namespace">
            <h3 is="sui-header">Add Mapping for {{ namespace }}</h3>

            <p>Once we have created a namespace prefix definition for a public vocabulary/schema, we can create actual mappings for individual
               elements in our graph to elements in the public schemas and vice-versa. We use the <code class="literal">n10s.mapping.add</code> procedure for this. This method takes two parameters:
            </p>

            <sui-form>
                <sui-form-field>
                    <label>Schema Element Name</label>
                    <sui-input
                        type="url"
                        placeholder="Schema Element Name"
                        icon="sitemap"
                        icon-position="left"
                        v-model="schemaElementName"
                    />
                </sui-form-field>
                <sui-form-field>
                    <label>Graph Element Name</label>
                    <sui-input
                        type="url"
                        placeholder="Graph Element Name"
                        icon="long arrow alternate right"
                        icon-position="left"
                        v-model="graphElementName"
                    />
                </sui-form-field>

                <code-block v-if="addMappingCypher" :code="addMappingCypher" />

                <sui-button primary :loading="loading" @click.prevent="addMapping">Add Mapping</sui-button>
            </sui-form>
        </sui-segment>
    </sui-container>
</template>

<script>
import CodeBlock from '../components/CodeBlock'

export default {
    components: {
        CodeBlock,
    },
    data: () => ({
        loading: false,
        confirmation: undefined,
        error: undefined,

        namespaces: [],
        namespace: undefined,

        mappings: [],

        // formats,
        // queryTypes,
        // format: 'JSON-LD',
        // type: 'fetch', // fetch | inline

        // // Add Schema
        // addError: false,
        // addConfirmation: false,
        // addUri: 'http://schema.org/',
        // addPrefix: 'sch',

        // activeSchema: false,
        // schemas: [],
        // mappings: [],

        // // Add Mapping
        graphElementName: '',
        schemaElementName: '',


    }),
    mounted() {
        this.loadNamespaces()
        this.loadMappings()
    },

    computed: {
        addMappingCypher() {
            if ( !this.schemaElementName || !this.graphElementName ) return

            return `CALL n10s.mapping.add('${this.namespace}${this.schemaElementName}', '${this.graphElementName.replace()}')`
        },
        namespaceMappings() {
            return this.mappings.filter(row => row.schemaNs === this.namespace)
        },
    },

    methods: {
        loadNamespaces() {
            this.$neo4j.run(`
                CALL n10s.nsprefixes.list()
            `)
                .then(({ records }) => {
                    this.namespaces = records.map(row => ({
                        text: `${row.get('prefix')} - ${row.get('namespace')}`,
                        key: row.get('namespace'),
                        value: row.get('namespace'),
                    }))
                })
        },
        loadMappings() {
            this.$neo4j.run(`
                CALL n10s.mapping.list()
            `)
                .then(({ records }) => {
                    this.mappings = records.map(row => Object.fromEntries(row.keys.map(key => [ key, row.get(key) ])))
                })
                .then(() => this.loading = false)
        },
        addMapping() {
            if ( !this.addMappingCypher ) return;

            this.loading = true
            return this.$neo4j.run(this.addMappingCypher)
                .then(() => this.confirmation = `Mapping added from ${this.namespace}${this.schemaElementName} to ${this.graphElementName}`)
                .then(() => this.loadMappings())
                .catch(e => this.error = e)
                .finally(() => this.loading = false)
        },
        dropMapping(mapping) {
            this.loading = true
            return this.$neo4j.run(`CALL n10s.mapping.drop($elemName)`, mapping)
                .then(() => this.confirmation = `Mapping dropped for from ${mapping.elemName}`)
                .then(() => this.loadMappings())
                .catch(e => this.error = e)
                .finally(() => this.loading = false)

        },
        closeError() {
            this.error = undefined
        },
        closeConfirmation() {
            this.confirmation = undefined
        },
    }

    // computed: {
    //     activeSchemaDetails() {
    //         return this.schemas && this.schemas.find(schema => schema.namespace === this.activeSchema)
    //     },
    //     activeMappings() {
    //         return this.mappings.filter(mapping => mapping.schemaNs === this.activeSchema)
    //     },
    // },

    // methods: {
    //     setActive(schema) {
    //         this.activeSchema = schema.namespace
    //     },
    //     loadSchemas() {
    //         this.$neo4j.run(`
    //             CALL n10s.mapping.listMappings() YIELD schemaNs, schemaPrefix, schemaElement, elemName
    //             WITH collect({schemaNs: schemaNs, schemaPrefix: schemaPrefix, schemaElement: schemaElement, elemName: elemName}) AS mappings

    //             CALL n10s.mapping.listSchemas() YIELD prefix, namespace
    //             WITH mappings, collect({prefix: prefix, namespace: namespace}) AS schemas

    //             RETURN mappings, schemas
    //         `)
    //             .then(({ records }) => {
    //                 const [ first ] = records;

    //                 if ( !first ) {
    //                     this.schemas = []
    //                     this.mappings = []

    //                     return
    //                 }

    //                 this.schemas = first.get('schemas')
    //                 this.mappings = first.get('mappings')

    //                 this.activeSchema = this.schemas[0].namespace
    //             })
    //     },
    //     addSchema() {
    //         if ( !this.addUri || this.addUri === '' || !this.addPrefix || this.addPrefix === '' ) {
    //             return
    //         }

    //         this.$neo4j.run(
    //             `CALL n10s.mapping.addSchema($uri, $prefix)`,
    //             { uri: this.addUri, prefix: this.addPrefix }
    //         )
    //             .then(() => {
    //                 this.loadSchemas()

    //                 this.addConfirmation = `Schema added for ${this.addUri} with prefix ${this.addPrefix}`
    //                 this.addUri = null
    //                 this.addPrefix = null
    //             })
    //             .catch(e => this.addError = e)
    //     },
    //     addCommonSchemas() {
    //         this.runQuery(
    //             `CALL n10s.mapping.addCommonSchemas`,
    //             { uri: this.addUri, prefix: this.addPrefix }
    //         )
    //             .then(() => {
    //                 this.loadSchemas()

    //                 this.confirmation = `Common schemas added successfully!`
    //             })

    //     },
    //     dropActiveSchema() {
    //         const namespace = this.activeSchema

    //         this.runQuery(`CALL n10s.mapping.dropSchema($namespace)`, { namespace })
    //             .then(() => {
    //                 this.schemas.splice( this.schemas.findIndex(s => s.namespace === namespace), 1)

    //                 this.confirmation = `Schema ${namespace} dropped`
    //             })
    //             .then(() => this.activeSchema = this.schemas[0].namespace)
    //     },
    //     removeAllSchemas() {
    //         this.runQuery(`CALL n10s.nsprefixes.removeAll()`)
    //             .then(() => {
    //                 this.schemas = []
    //                 this.confirmation = `All schemas have been removed`
    //             })
    //     },
    //     closeAddError() {
    //         this.addError = false
    //     },
    //     closeAddConfirmation() {
    //         this.addConfirmation = false
    //     },
    //     addMappingToSchema() {
    //         if ( !this.graphElementName || this.graphElementName === '' || !this.schemaElementName || this.schemaElementName === '' ) {
    //             return;
    //         }

    //         const { activeSchema, graphElementName, schemaElementName } = this

    //         this.$neo4j.run(
    //             `CALL n10s.mapping.addMappingToSchema($activeSchema, $graphElementName, $schemaElementName)`,
    //             { activeSchema, graphElementName, schemaElementName }
    //         )
    //             .then(({ records }) => {
    //                 const [ first ] = records

    //                 this.mappings.push({
    //                     schemaNs: first.get('schemaNs'),
    //                     schemaPrefix: first.get('schemaPrefix'),
    //                     schemaElement: first.get('schemaElement'),
    //                     elemName: first.get('elemName'),
    //                 })

    //                 this.addConfirmation = `Mapping for ${schemaElementName} added to ${activeSchema}`

    //                 this.graphElementName = null
    //                 this.schemaElementName = null
    //             })
    //     },
    //     dropMapping(mapping) {
    //         this.runQuery(
    //             `CALL n10s.mapping.dropMapping($graphElementName)`,
    //             { graphElementName: mapping.elemName }
    //         )
    //         .then(() => {
    //             this.confirmation = `Mapping for ${mapping.elemName} dropped`

    //             this.mappings.splice( this.mappings.findIndex(el => el.elemName === mapping.elemName) , 1)
    //         })
    //     },
    // },
}
</script>

<style>

</style>