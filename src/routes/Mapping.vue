<template>
    <sui-container class="main">
        <h1>Mapping your RDF data to Neo4j</h1>

        <sui-message positive v-if="confirmation" dismissable @dismiss="closeConfirmation">{{ confirmation }}</sui-message>
        <sui-message negative v-if="error" dismissable @dismiss="closeError">{{ error }}</sui-message>

        <sui-grid>
            <sui-grid-column :width="4">
                <sui-menu fluid vertical tabular pointed>
                    <a is="sui-menu-item" v-for="schema in schemas" :key="schema.namespace" @click="setActive(schema)" :active="schema.namespace === activeSchema">
                        <strong>{{ schema.prefix }}</strong><br>
                        <span style="overflow-wrap: break-word; opacity: .5; display: block; margin-top: .4em;">{{ schema.namespace }}</span>
                    </a>
                </sui-menu>
            </sui-grid-column>
            <sui-grid-column stretched :width="12">
                <!-- <pre>{{ activeSchemaDetails }}</pre> -->

                <div v-if="activeSchemaDetails">
                    <h2 is="sui-header">{{ activeSchemaDetails.prefix }}</h2>
                    <sui-list>
                        <sui-list-item icon="server" :content="activeSchemaDetails.namespace" />
                    </sui-list>

                    <sui-segment>
                        <h3 is="sui-header">Mappings</h3>

                        <p>Once we have defined a reference to a public vocabulary/schema, we can now create actual mappings for elements in our graph to elements in the public schemas. The mapping.addMappingToSchema procedure. This method takes three parameters, the URI of a public schema previously added via mapping.addSchema and a pair formed by the name of the element in our graph (a property name, a label or a relationship type) and the matching element in the public schema.</p>
                        <p>The following example shows how to define a map from a CHILD_CATEGORY relationship type in a Neo4j graph to the skos:narrower relationship (or ObjectProperty in RDF terminology).</p>

                        <sui-list divided relaxed>
                            <sui-list-item v-for="mapping in activeMappings" :key="mapping.schemaElement">
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

                        <h4>Add Mapping</h4>
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
                            <sui-button primary @click.prevent="addMappingToSchema">Add Mapping</sui-button>
                        </sui-form>
                    </sui-segment>

                    <sui-message negative visible>
                        <h3 is="sui-header">Drop Schema</h3>

                        <p>References to schemas can be removed using the <code>mapping.dropSchema</code> method and passing as single parameter the exact URI of the vocabulary we want to have deleted. Notice that this will remove both the schema and all element mappings defined on it.</p>

                        <pre>CALL n10s.mapping.dropSchema('{{ activeSchemaDetails.namespace }}')</pre>
                        <p>Be careful, this cannot be undone.</p>

                        <sui-button negative @click.prevent="dropActiveSchema">
                            Drop
                            {{ activeSchemaDetails.prefix }}
                        </sui-button>
                    </sui-message>
                </div>
            </sui-grid-column>
        </sui-grid>

        <sui-grid>
            <sui-grid-column>
                <sui-segment>
                    <sui-form>
                        <h3 is="sui-header">Add Schema</h3>
                        <sui-message negative v-if="addError" dismissable @dismiss="closeAddError">{{ addError }}</sui-message>
                        <sui-message positive v-if="addConfirmation" dismissable @dismiss="closeAddConfirmation">{{ addConfirmation }}</sui-message>
                        <sui-form-field>
                            <label>Schema URI</label>
                            <sui-input
                                type="url"
                                placeholder="uri"
                                icon="server"
                                icon-position="left"
                                v-model="addUri"
                            />
                        </sui-form-field>
                        <sui-form-field>
                            <label>Prefix</label>
                            <sui-input
                                type="text"
                                placeholder="Prefix"
                                icon="circle"
                                icon-position="left"
                                v-model="addPrefix"
                            />
                        </sui-form-field>

                        <sui-button primary :loading="loading" @click.prevent="addSchema">
                            Add Schema
                        </sui-button>

                        <sui-button basic primary @click.prevent="addCommonSchemas">Add Common Schemas</sui-button>
                    </sui-form>
                </sui-segment>


                <sui-message negative>
                    <h3 is="sui-header">Remove All Schemas</h3>
                    <p>Remove all Schemas</p>

                    <pre>CALL n10s.nsprefixes.removeAll()</pre>
                    <p>Be careful, this cannot be undone.</p>

                    <sui-button negative @click.prevent="removeAllSchemas">Remove All Schemas</sui-button>
                </sui-message>
            </sui-grid-column>
        </sui-grid>
    </sui-container>
</template>

<script>
import CypherComponent from '@/components/CypherComponent'
import { formats, queryTypes } from '../constants'

export default {
    mixins: [ CypherComponent, ],
    data: () => ({

        formats,
        queryTypes,
        format: 'JSON-LD',
        type: 'fetch', // fetch | inline

        // Add Schema
        addError: false,
        addConfirmation: false,
        addUri: 'http://schema.org/',
        addPrefix: 'sch',

        activeSchema: false,
        schemas: [],
        mappings: [],

        // Add Mapping
        graphElementName: null,
        schemaElementName: null,
    }),
    created() {
        this.loadSchemas()
    },

    computed: {
        activeSchemaDetails() {
            return this.schemas && this.schemas.find(schema => schema.namespace === this.activeSchema)
        },
        activeMappings() {
            return this.mappings.filter(mapping => mapping.schemaNs === this.activeSchema)
        },
    },

    methods: {
        setActive(schema) {
            this.activeSchema = schema.namespace
        },
        loadSchemas() {
            this.$neo4j.run(`
                CALL n10s.mapping.listMappings() YIELD schemaNs, schemaPrefix, schemaElement, elemName
                WITH collect({schemaNs: schemaNs, schemaPrefix: schemaPrefix, schemaElement: schemaElement, elemName: elemName}) AS mappings

                CALL n10s.mapping.listSchemas() YIELD prefix, namespace
                WITH mappings, collect({prefix: prefix, namespace: namespace}) AS schemas

                RETURN mappings, schemas
            `)
                .then(({ records }) => {
                    const [ first ] = records;

                    if ( !first ) {
                        this.schemas = []
                        this.mappings = []

                        return
                    }

                    this.schemas = first.get('schemas')
                    this.mappings = first.get('mappings')

                    this.activeSchema = this.schemas[0].namespace
                })
        },
        addSchema() {
            if ( !this.addUri || this.addUri === '' || !this.addPrefix || this.addPrefix === '' ) {
                return
            }

            this.$neo4j.run(
                `CALL n10s.mapping.addSchema($uri, $prefix)`,
                { uri: this.addUri, prefix: this.addPrefix }
            )
                .then(() => {
                    this.loadSchemas()

                    this.addConfirmation = `Schema added for ${this.addUri} with prefix ${this.addPrefix}`
                    this.addUri = null
                    this.addPrefix = null
                })
                .catch(e => this.addError = e)
        },
        addCommonSchemas() {
            this.runQuery(
                `CALL n10s.mapping.addCommonSchemas`,
                { uri: this.addUri, prefix: this.addPrefix }
            )
                .then(() => {
                    this.loadSchemas()

                    this.confirmation = `Common schemas added successfully!`
                })

        },
        dropActiveSchema() {
            const namespace = this.activeSchema

            this.runQuery(`CALL n10s.mapping.dropSchema($namespace)`, { namespace })
                .then(() => {
                    this.schemas.splice( this.schemas.findIndex(s => s.namespace === namespace), 1)

                    this.confirmation = `Schema ${namespace} dropped`
                })
                .then(() => this.activeSchema = this.schemas[0].namespace)
        },
        removeAllSchemas() {
            this.runQuery(`CALL n10s.nsprefixes.removeAll()`)
                .then(() => {
                    this.schemas = []
                    this.confirmation = `All schemas have been removed`
                })
        },
        closeAddError() {
            this.addError = false
        },
        closeAddConfirmation() {
            this.addConfirmation = false
        },
        addMappingToSchema() {
            if ( !this.graphElementName || this.graphElementName === '' || !this.schemaElementName || this.schemaElementName === '' ) {
                return;
            }

            const { activeSchema, graphElementName, schemaElementName } = this

            this.$neo4j.run(
                `CALL n10s.mapping.addMappingToSchema($activeSchema, $graphElementName, $schemaElementName)`,
                { activeSchema, graphElementName, schemaElementName }
            )
                .then(({ records }) => {
                    const [ first ] = records

                    this.mappings.push({
                        schemaNs: first.get('schemaNs'),
                        schemaPrefix: first.get('schemaPrefix'),
                        schemaElement: first.get('schemaElement'),
                        elemName: first.get('elemName'),
                    })

                    this.addConfirmation = `Mapping for ${schemaElementName} added to ${activeSchema}`

                    this.graphElementName = null
                    this.schemaElementName = null
                })
        },
        dropMapping(mapping) {
            this.runQuery(
                `CALL n10s.mapping.dropMapping($graphElementName)`,
                { graphElementName: mapping.elemName }
            )
            .then(() => {
                this.confirmation = `Mapping for ${mapping.elemName} dropped`

                this.mappings.splice( this.mappings.findIndex(el => el.elemName === mapping.elemName) , 1)
            })
        },
    },
}
</script>

<style>

</style>