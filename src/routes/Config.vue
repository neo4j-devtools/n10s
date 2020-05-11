<template>
    <sui-container class="main">
        <h1 is="sui-header">Graph Configuration</h1>

        <p>
            Before any RDF import operation a <code>GraphConfig</code> needs to be created. Here we define the way the RDF data is persisted in Neo4j.
            The following settings are valid throughout the life of your Neo4j graph and across multiple invocations of
             import/export/delete/preview/stream procedures.
        </p>

        <sui-form>
            <sui-form-field>
                <label>handleVocabUris</label>
                <sui-dropdown
                    fluid
                    :options="handleVocabUriOptions"
                    placeholder="handleVocabUris"
                    search
                    selection
                    v-model="handleVocabUris"
                />
                <Asciidoc file="./asciidoc/includes/reference/handleVocabUris.adoc" />
            </sui-form-field>
            <sui-form-field>
                <label>handleMultival</label>
                <sui-dropdown
                    fluid
                    :options="handleMultivalOptions"
                    placeholder="handleMultival"
                    search
                    selection
                    v-model="handleMultival"
                />
            </sui-form-field>
            <Asciidoc file="./asciidoc/includes/reference/handleMultival.adoc" />
            <sui-form-field>
                <label>multivalPropList</label>
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
                <Asciidoc file="./asciidoc/includes/reference/multivalPropList.adoc" />
            </sui-form-field>
            <sui-form-field>
                <sui-checkbox toggle label="keepLangTag" v-model="keepLangTag" />
                <Asciidoc file="./asciidoc/includes/reference/keepLangTag.adoc" />
            </sui-form-field>
            <sui-form-field>
                <label>handleRDFTypes</label>
                <sui-dropdown
                    fluid
                    :options="handleRDFTypesOptions"
                    placeholder="handleRDFTypes"
                    search
                    selection
                    v-model="handleRDFTypes"
                />
                <Asciidoc file="./asciidoc/includes/reference/handleRDFTypes.adoc" />
            </sui-form-field>

            <sui-form-field>
                <sui-checkbox toggle label="keepCustomDataTypes" v-model="keepCustomDataTypes" />
                <Asciidoc file="./asciidoc/includes/reference/keepCustomDataTypes.adoc" />
            </sui-form-field>

            <sui-form-field v-if="keepCustomDataTypes">
                <label>customDataTypePropList</label>
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
                <Asciidoc file="./asciidoc/includes/reference/customDataTypePropList.adoc" />
            </sui-form-field>
            <sui-form-field>
                <sui-checkbox toggle label="applyNeo4jNaming" v-model="applyNeo4jNaming" />
                <Asciidoc file="./asciidoc/includes/reference/applyNeo4jNaming.adoc" />
            </sui-form-field>

            <sui-button primary :loading="loading" @click.prevent="runQuery">
                {{ buttonText }}
            </sui-button>
        </sui-form>

        <p>&nbsp;</p>

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

import Asciidoc from '@/components/Asciidoc'
import CypherComponent from '@/components/CypherComponent'

export default {
    name: 'config',
    mixins: [ CypherComponent, ],
    components: {
        Asciidoc,
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