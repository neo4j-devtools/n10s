<template>
    <sui-container>
        <h1 is="sui-header">Import Data with SPARQL</h1>

        <p>
            Import the result of a <code>SPARQL CONSTRUCT</code> or <code>SPARQL DESCRIBE</code> query into Neo4j.
            Select the SPARQL endpoint you want to use and enter your RDF-generating SPARQL query in the form below.
        </p>

        <sui-segment>
            <strong is="sui-header">Example Endpoints</strong>
            <!-- <p>There are a number of example SPARQL services that can be queried.  You can either select a template below or complete with your own SPARQL service.</p> -->

            <sui-form-field>
                <sui-dropdown
                    fluid
                    :options="sparqlExamples"
                    placeholder="Example Service"
                    search
                    selection
                    v-model="example"
                />
            </sui-form-field>

            <div v-if="post">
                <a :href="post" target="_blank">
                    <sui-icon name="newspaper" />
                    Read Blog Post
                </a>
            </div>
        </sui-segment>




        <sui-form>

            <sui-form-field>
                <label>Query Type</label>
                <sui-dropdown
                    fluid
                    :options="types"
                    placeholder="Format"
                    search
                    selection
                    v-model="type"
                />
            </sui-form-field>


            <sui-form-field>
                <label>URL</label>
                <sui-input
                    type="url"
                    placeholder="URL"
                    icon="server"
                    icon-position="left"
                    v-model="url"
                />
            </sui-form-field>

            <sui-form-field>
                <label>RDF Query</label>
                <textarea v-model="query" />
            </sui-form-field>

            <sui-form-field>
                <label>Input Format</label>
                <sui-dropdown
                    fluid
                    :options="formats"
                    placeholder="Format"
                    search
                    selection
                    v-model="format"
                />
            </sui-form-field>

            <sui-form-field>
                <p>To save potentially having to reformat the query, we will use a <a href="https://neo4j.com/docs/cypher-manual/current/syntax/parameters/" target="_blank"><code>$param</code></a>.  To set this query in Neo4j Browser, run the following command:</p>
                <pre>:param query: '{{ params.query }}'</pre>
            </sui-form-field>

            <sui-button primary :loading="loading" @click.prevent="runQuery">
                {{ buttonText }}
            </sui-button>

        </sui-form>

         <n10s-cypher-tabs
            v-if="cypher"
            :loading="loading"
            :cypher="cypher"
            :result="result"
            :error="error"
            :tab="tab"
            :buttonText="buttonText"
        />

    </sui-container>
</template>

<script>
/* eslint-disable */
import { formats, sparqlExamples, } from '../constants'
import CypherComponent from '@/components/CypherComponent'

export default {
    name: 'sparql',
    mixins: [ CypherComponent, ],
    data: () => ({
        buttonText: 'Run SPARQL Query',
        formats,
        types: [
            { key: 'preview', text: 'Preview', value: 'preview', },
            { key: 'preview', text: 'Import', value: 'import', },
        ],
        type: 'preview',


        sparqlExamples,
        example: sparqlExamples[0].value,

        url: sparqlExamples[0].url,
        query: sparqlExamples[0].query,
        post: sparqlExamples[0].query,
        format: 'Turtle',
    }),

    computed: {
        cypher() {
        return `CALL n10s.rdf.${this.type}.fetch(
    "${this.url}"+ $query,
    "${this.format}",
    ${JSON.stringify(this.parameters)}
)`
        },
        parameters: () => ({}),
        params() {
            return {
                query: this.query.replace(/\n/g, ' ').replace(/'/g, "\\'"),
            }
        },

    },
    watch: {
        example() {
            const { url, query, post } = this.sparqlExamples.find(example => example.value === this.example)

            this.url = url
            this.query = query
            this.post = post
        },
    },
}
</script>

<style>
.results {
    min-height: 120px;
}
</style>