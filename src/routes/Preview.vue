<template>
    <sui-container class="main">
        <h1 is="sui-header">Previewing Data</h1>

        <p>
            Sometimes before we go ahead and import RDF data into Neo4j we want to see what it looks like or we may even want to take full control with Cypher over the data ingestion process and customise what to do with each parsed triple. For these purpose NSMNTX provides the following procedures.
        </p>

        <!-- TODO: This could be it's own component -->
        <sui-form>

            <sui-form-field>
                <label>Format</label>
                <sui-dropdown
                    fluid
                    :options="previewTypes"
                    selection
                    v-model="type"
                />
            </sui-form-field>


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
            :displayAs="displayAs"
        />
    </sui-container>
</template>

<script>
import { formats, url, previewTypes } from '../constants'
import CypherComponent from './CypherComponent'

export default {
    name: 'preview',
    mixins: [ CypherComponent, ],
    data: () => ({
        formats,
        url,
        previewTypes,
        type: 'stream',
        format: 'Turtle',
        // buttonText: 'Get Preview'
    }),
    computed: {
        buttonText() {
            return `Get ${this.type.charAt(0).toUpperCase() + this.type.slice(1)}`
        },
        cypher() {
            return `CALL n10s.rdf.${this.type}.fetch(
    "${this.url}",
    "${this.format}",
    ${JSON.stringify(this.parameters)}
)`
        },
        parameters() {
            return {}
        },
        displayAs() {
            return this.type === 'preview' ? 'graph' : 'table'
        }
    },
    watch: {
        type() {
            this.result = false
            this.tab = 0
        },
    },
}
</script>