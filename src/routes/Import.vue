<template>
    <n10s-query-form
        buttonText="Import Data"
        procedure="n10s.rdf.import"
    >
        <h1 is="sui-header">Import Data</h1>

        <p>
            The main method for importing RDF is <code>semantics.importRDF</code>.
            It imports and persists into Neo4j the triples returned by an url.
            This url can point to an RDF file (local or remote) or a service producing
            RDF dynamically. More on how to parameterise the access to web services in section x[link].
        </p>

        <!-- <sui-form>
            <sui-form-field>
                <label>URL</label>
                <sui-input
                    type="url"
                    placeholder="Password"
                    icon="server"
                    icon-position="left"
                    v-model="url"
                />
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
        /> -->
    </n10s-query-form>
</template>

<script>
import { formats, url } from '../constants'
import CypherComponent from '@/components/CypherComponent'

export default {
    name: 'import',
    mixins: [ CypherComponent, ],
    data: () => ({
        formats,
        url,
        format: 'Turtle',
        buttonText: 'Run Import Procedure'
    }),

    computed: {
        cypher() {
        return `CALL n10s.rdf.import.fetch(
    "${this.url}",
    "${this.format}",
    ${JSON.stringify(this.parameters)}
)`
        },
        parameters() {
            return {}
        },

    },
}
</script>

<style>
.results {
    min-height: 120px;
}
</style>