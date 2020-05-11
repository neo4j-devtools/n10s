<template>
    <n10s-query-form
        buttonText="Preview Data"
        procedure="n10s.rdf"
        showDisplayAs
    >
        <h1 is="sui-header">Previewing Data</h1>

        <p>
            Sometimes before we go ahead and import RDF data into Neo4j we want to see what it looks like or we may even want to take full control with Cypher over the data ingestion process and customise what to do with each parsed triple. For these purpose NSMNTX provides the following procedures.
        </p>
    </n10s-query-form>
</template>

<script>

export default {
    name: 'preview',

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