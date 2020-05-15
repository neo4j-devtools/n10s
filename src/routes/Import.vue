<template>
    <n10s-query-form
        buttonText="Import Data"
        procedure="n10s.rdf.import"
        queryLabel="RDF"
    >
        <h1 is="sui-header">Import Data</h1>

        <p>
            Import RDF data into Neo4j!
        </p>
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