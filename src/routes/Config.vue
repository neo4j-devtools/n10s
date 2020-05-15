<template>
    <sui-container>
        <h1 is="sui-header">Graph Configuration</h1>

        <p>
            Before any RDF import operation a <code>GraphConfig</code> needs to be created. Here we define the way the RDF data is persisted in Neo4j.
            The following settings are valid throughout the life of your Neo4j graph and across multiple invocations of
             import/export/delete/preview/stream procedures.
        </p>

        <sui-form class="config">
            <sui-form-field>
                <label>handleVocabUris</label>
                <sui-grid>
                    <sui-grid-column :width="8">
                        <sui-dropdown
                            fluid
                            :options="handleVocabUriOptions"
                            placeholder="handleVocabUris"
                            search
                            selection
                            v-model="handleVocabUris"
                        />
                    </sui-grid-column>
                    <sui-grid-column :width="6" class="hint">
                        <ul>
                            <li>'SHORTEN', full uris are shortened using prefixes for property names, relationship names and labels. Prefixes can be defined upfront and for those undefined, n10s will dynamically generate one of the form <code>ns1</code>,<code>ns2</code>...</li>
                            <li>'SHORTEN_STRICT', same behavior <code>'SHORTEN'</code> but fails if a prefix is not predefined for a namespace in the imported RDF.</li>
                            <li>'IGNORE' uris are ignored and only local names are kept</li>
                            <li>'MAP' vocabulary element mappings are applied on import</li>
                            <li>'KEEP' uris are kept unchanged</li>
                        </ul>
                    </sui-grid-column>
                </sui-grid>
            </sui-form-field>
            <sui-form-field>
                <label>handleMultival</label>
                <sui-grid>
                    <sui-grid-column :width="8">
                        <sui-dropdown
                            fluid
                            :options="handleMultivalOptions"
                            placeholder="handleMultival"
                            search
                            selection
                            v-model="handleMultival"
                        />
                    </sui-grid-column>
                    <sui-grid-column :width="6" class="hint">
                        <ul>
                            <li>
                                <p>'OVERWRITE' property values are kept single valued. Multiple values in the imported RDF are overwriten (only the last one is kept)</p>
                            </li>
                            <li>
                                <p>'ARRAY' properties are stored in an array enabling storage of multiple values. All of them unless <code>multivalPropList</code> is set.</p>
                            </li>
                        </ul>
                    </sui-grid-column>
                </sui-grid>
            </sui-form-field>
            <sui-form-field>
                <label>multivalPropList</label>
                <sui-grid>
                    <sui-grid-column :width="8">
                        <sui-dropdown
                            multiple
                            fluid
                            :options="[]"
                            placeholder="Press enter to add a new value"
                            search
                            selection
                            allow-additions
                            v-model="multivalPropList"
                        />
                    </sui-grid-column>
                    <sui-grid-column :width="6" class="hint">
                        <p>List of property names (full uri) to be stored as arrays. The rest are treated as 'OVERWRITE'.</p>
                    </sui-grid-column>
                </sui-grid>
            </sui-form-field>
            <sui-form-field>
                <sui-grid>
                    <sui-grid-column :width="8">
                        <sui-checkbox toggle label="keepLangTag" v-model="keepLangTag" />
                    </sui-grid-column>
                    <sui-grid-column :width="6" class="hint">
                        <p>When set to true, the language tag is kept along with the property value. Useful for multilingual datasets.  Use helper function <code>getLangValue</code> to get specific values.</p>
                    </sui-grid-column>
                </sui-grid>
            </sui-form-field>
            <sui-form-field>
                <label>handleRDFTypes</label>
                <sui-grid>
                    <sui-grid-column :width="8">
                        <sui-dropdown
                            fluid
                            :options="handleRDFTypesOptions"
                            placeholder="handleRDFTypes"
                            search
                            selection
                            v-model="handleRDFTypes"
                        />
                    </sui-grid-column>
                    <sui-grid-column :width="6" class="hint">
                        <ul>
                            <li>
                                <p>'LABELS', rdf:type statements are imported as node labels in Neo4j</p>
                            </li>
                            <li>
                                <p>'NODES', rdf:type statements are imported as <code>rdf__type</code> relationships to a node representing the class</p>
                            </li>
                            <li>
                                <p>'LABELS_AND_NODES' rdf:type statements are stored (in a redundant way) as in both previously described cases.</p>
                            </li>
                        </ul>
                    </sui-grid-column>
                </sui-grid>
            </sui-form-field>

            <sui-form-field>
                <sui-grid>
                    <sui-grid-column :width="8">
                        <sui-checkbox toggle label="keepCustomDataTypes" v-model="keepCustomDataTypes" />
                    </sui-grid-column>
                    <sui-grid-column :width="6" class="hint">
                        <p>When set to true, all properties containing a custom data type will be saved as a string followed by their custom data type IRIs</p>
                    </sui-grid-column>
                </sui-grid>
            </sui-form-field>

            <sui-form-field v-if="keepCustomDataTypes">
                <label>customDataTypePropList</label>
                <sui-grid>
                    <sui-grid-column :width="8">
                        <sui-dropdown
                            multiple
                            fluid
                            :options="[]"
                            placeholder="when set, only custom data types of literal properties in this list are imported."
                            search
                            selection
                            allow-additions
                            v-model="customDataTypePropList"
                        />
                    </sui-grid-column>
                    <sui-grid-column :width="6" class="hint">
                        <p>When set, only custom data types of literal properties in this list are imported</p>
                    </sui-grid-column>
                </sui-grid>
            </sui-form-field>
            <sui-form-field>
                <sui-grid>
                    <sui-grid-column :width="8">
                        <sui-checkbox toggle label="applyNeo4jNaming" v-model="applyNeo4jNaming" />
                    </sui-grid-column>
                    <sui-grid-column :width="6" class="hint">
                        <div class="paragraph">
                            <p>
                                When set to true and in combination with <code>handleVocabUris: 'IGNORE'</code>, Neo4j
                                capitalisation is applied to vocabulary elements (all caps for relationship types, capital first for labels, etc.)
                            </p>
                        </div>
                    </sui-grid-column>
                </sui-grid>
            </sui-form-field>

            <sui-button primary :loading="loading" @click.prevent="runQuery">
                {{ buttonText }}
            </sui-button>
        </sui-form>

        <n10s-cypher-tabs
            :cypher="cypher"
            :result="result"
            :error="error"
            :tab="tab"
            :buttonText="buttonText"
        />
    </sui-container>
</template>

<script>
import { handleVocabUriOptions, handleMultivalOptions, handleRDFTypesOptions } from '../constants'

// import Asciidoc from '@/components/Asciidoc'
import CypherComponent from '@/components/CypherComponent'

export default {
    name: 'config',
    mixins: [ CypherComponent, ],
    components: {
        // Asciidoc,
    },
    data: () => ({
        buttonText: 'Create Config',

        handleVocabUris: '',
        handleVocabUriOptions,

        handleMultival: '',
        handleMultivalOptions,

        multivalPropList: [],

        keepLangTag: undefined,

        handleRDFTypes: '',
        handleRDFTypesOptions,

        keepCustomDataTypes: undefined,
        customDataTypePropList: [],

        applyNeo4jNaming: undefined,
    }),
    computed: {
        cypher() {
            let params = []
            const keys = ['handleVocabUris', 'handleMultival', 'multivalPropList', 'keepLangTag', 'handleRDFTypes', 'keepCustomDataTypes', 'customDataTypePropList', 'applyNeo4jNaming']
            const booleans = ['keepLangTag', 'keepCustomDataTypes', 'applyNeo4jNaming']

            // TODO: Cast the different types
            keys.map(key => {
                let value = this[ key ]

                if ( value === undefined || value === '' ) return;

                if ( Array.isArray(value) ) {

                    if ( value.length === 0 ) return

                    value = `'${value.join("', '")}'`
                }

                // Add quotes
                console.log(key, booleans, booleans.includes(key));

                value = booleans.includes(key) ? value.toString() : `'${value}'`

                params.push(`${key}: ${value}`)

            })
            if ( params.length ) {
                params = `{\n\t${params.join(',\n\t')}\n}`
            }

            return `CALL n10s.graphconfig.init(${params})`
        },
    },
}
</script>

<style>
.config .field {border-top: 1px solid rgba(0, 0, 0, .1)}
.config ul {margin-top: 0; padding-left: 0;}
.config .hint {color: rgba(0,0,0,.5); padding-bottom: 12px;}
.config .field {margin-bottom:12px; padding-top: 12px}
.config .checkbox label {font-weight: bold}
.config .checkbox input {margin-bottom: 12px;}
</style>