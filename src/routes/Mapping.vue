<template>
    <sui-container class="main">
        <h1>Mapping your RDF data to Neo4j</h1>

        <p>Some blurb</p>

        <!-- <sui-form>
            <sui-form-field>
                <label>Format</label>
                <sui-dropdown
                    fluid
                    :options="queryTypes"
                    placeholder="Query Type"
                    search
                    selection
                    v-model="type"
                />
            </sui-form-field>
            <sui-form-field v-if="type === 'fetch'">
                <label>URL</label>
                <sui-input
                    type="url"
                    placeholder="URL"
                    icon="server"
                    icon-position="left"
                    v-model="url"
                />
            </sui-form-field>
            <sui-form-field v-if="type === 'inline'">
                <label>Format</label>
                <textarea rows="10"></textarea>
            </sui-form-field>
            <sui-form-field>
                <label>Format</label>
                <sui-dropdown
                    fluid
                    :options="formats"
                    placeholder="Format"
                    search
                    selection
                    v-model="format"
                />
            </sui-form-field>
            <sui-button primary :loading="loading" @click.prevent="runQuery">
                Load Preview
            </sui-button>
        </sui-form> -->


        <sui-grid>
            <sui-grid-column :width="4">
                <sui-menu fluid vertical tabular pointed>
                    <a is="sui-menu-item" v-for="schema in schemas" :key="schema.namespace" @click="setActive(schema)" :active="schema.namespace === activeSchema">{{ schema.namespace }}</a>

                </sui-menu>

                <sui-form>
                    <sui-form-field>
                        <label>Schema URI</label>
                        <sui-input
                            type="url"
                            placeholder="uri"
                            icon="server"
                            icon-position="left"
                            v-model="url"
                        />
                    </sui-form-field>
                    <sui-form-field>
                        <label>Prefix</label>
                        <sui-input
                            type="text"
                            placeholder="Prefix"
                            icon="circle"
                            icon-position="left"
                            v-model="prefix"
                        />
                    </sui-form-field>

                    <sui-button primary :loading="loading" @click.prevent="add">
                        Add Schema
                    </sui-button>
                </sui-form>
            </sui-grid-column>
            <sui-grid-column stretched :width="12">
                <div v-if="activeSchema">
                    <pre>{{ activeMappings }}</pre>

                    <sui-button negative @click.prevent="dropActiveSchema">Drop Schema <span>{{ activeSchema }}</span></sui-button>
                </div>





            </sui-grid-column>
        </sui-grid>
    </sui-container>
</template>

<script>
import { formats, queryTypes } from '../constants'

export default {
    name: '',
    data: () => ({
        loading: false,
        error: false,
        result: false,

        formats,
        queryTypes,
        format: 'JSON-LD',
        type: 'fetch', // fetch | inline
        url: 'https://query.wikidata.org/sparql?query=CONSTRUCT%20%7B%0A%20%20%3Fcat%20rdfs%3Alabel%20%3FcatName%20.%0A%20%20%3FsubCat%20rdfs%3Alabel%20%3FsubCatName%20%3B%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP171%20%3FparentCat%20.%0A%20%20%7D%20%0AWHERE%20%7B%0A%20%20%3Fcat%20rdfs%3Alabel%20%22Riboviria%22%40en%20.%0A%20%20%3Fcat%20rdfs%3Alabel%20%3FcatName%20.%0A%20%20filter(lang(%3FcatName)%20%3D%20%22en%22)%20.%0A%20%20%3FsubCat%20wdt%3AP171%2B%20%3Fcat%20%3B%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP171%20%3FparentCat%3B%0A%20%20%20%20%20%20%20%20%20%20rdfs%3Alabel%20%3FsubCatName%0A%20%20%20%20%20%20%20%20%20%20filter(lang(%3FsubCatName)%20%3D%20%22en%22)%20.%0A%7D',

        activeSchema: false,
        schemas: [],
        mappings: [],
    }),
    created() {
        this.loadSchemas()
    },

    computed: {
        activeMappings() {
            return this.mappings.filter(mapping => mapping.schemaNs === this.activeSchema)
        },
    },

    methods: {
        setActive(schema) {
            this.activeSchema = schema.namespace
        },
        runQuery(query, params = {}) {
            this.loading = true

            return this.$neo4j.run(query, params)
                .catch(e => {
                    this.error = e

                    throw e
                })
                .finally(() => this.loading = false)

        },
        loadSchemas() {
            this.runQuery(`
                CALL n10s.mapping.listSchemas() YIELD prefix, namespace
                WITH collect({prefix: prefix, namespace: namespace}) AS schemas

                CALL n10s.mapping.listMappings() YIELD schemaNs, schemaPrefix, schemaElement, elemName
                RETURN schemas, collect({schemaNs: schemaNs, schemaPrefix: schemaPrefix, schemaElement: schemaElement, elemName: elemName}) AS mappings
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
        dropActiveSchema() {
            const namespace = this.activeSchema

            this.runQuery(`CALL n10s.mapping.dropSchema($namespace)`, { namespace })
                .then(() => this.schemas.splice( this.schemas.findIndex(s => s.namespace === namespace), 1))
                .then(() => this.activeSchema = this.schemas[0].namespace)
        },
//         runQuery() {
//             this.loading = true
// console.log(`
//                 CALL n10s.rdf.stream.fetch(
//                     $url,
//                     $format,
//                     { headerParams: { Accept: "application/ld+json"}}
//                 )
//                 YIELD predicate, literalType, object, subject
// RETURN predicate, literalType, collect(object)[0..5] AS objects, collect(subject)[0..5] AS subjects
//             `)
//             this.$neo4j.run(`
//                 CALL n10s.rdf.stream.fetch(
//                     $url,
//                     $format,
//                     { headerParams: { Accept: "application/ld+json"}}
//                 )
//                 YIELD predicate, literalType, object, subject
// RETURN predicate, literalType, collect(object)[0..5] AS objects, collect(subject)[0..5] AS subjects
//             `, { url: this.url, format: this.format })
//                 .then(res => this.result = res)
//                 .catch(e => this.error = e)
//                 .finally(this.loading = false)
//         },
    },
}
</script>

<style>

</style>