<template>
    <sui-container class="main">
        <h1 is="sui-header">Delete Data</h1>

        <p>
            The main method to delete RDF is <code>semantics.deleteRDF</code>.
            It deletes from Neo4j the triples returned by an url. This url can point to an RDF file (local or remote) or a service producing RDF dynamically. All delete procedures take the following three parameters, like the import procedures:
        </p>

        <sui-form>
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
        />
    </sui-container>
</template>

<script>
import { formats, url } from '../constants'
import CypherComponent from './CypherComponent'

export default {
    name: 'delete',
    mixins: [ CypherComponent, ],
    data: () => ({
        formats,
        url,
        format: 'Turtle',
        buttonText: 'Run Import Procedure'
    }),

    computed: {
        cypher() {
            return `CALL n10s.rdf.delete.fetch(
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