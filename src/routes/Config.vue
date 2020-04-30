<template>
    <sui-container class="main">
        <h1 is="sui-header">Graph Configuration</h1>

        <p>Before any RDF import operation a <code>GraphConfig</code> needs to be created. Here we define the way the RDF data is persisted in Neo4j.</p>

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

import CypherComponent from './CypherComponent'

export default {
    name: 'config',
    mixins: [ CypherComponent, ],
    data: () => ({
        buttonText: 'Create Config',

        handleVocabUris: '',
        handleVocabUriOptions,

        handleMultival: '',
        handleMultivalOptions,


        handleRDFTypes: '',
        handleRDFTypesOptions,

        multivalPropList: [],
    }),
    computed: {
        cypher() {
            let params = []
            const keys = ['handleVocabUris', 'handleMultival', 'handleRDFTypes']

            // TODO: Cast the different types
            keys.map(key => {
                if ( this[ key ] !== undefined && this[ key ] !== '' ) params.push(`${key}: '${this[key]}'`)
            })

            if ( params.length ) {
                params = `{\n\t${params.join(',\n\t')}\n}`
            }

            return `CALL n10s.graphconfig.init(${params})`
        },
    },
}
</script>