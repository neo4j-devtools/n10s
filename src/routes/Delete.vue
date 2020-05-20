<template>
    <n10s-query-form
        buttonText="Delete Data"
        procedure="n10s.rdf.delete"
        queryLabel="RDF"
    >
                <h1 is="sui-header">Delete Data</h1>

        <p>
            The <code>n10s.rdf.delete.*</code> procedure deletes all of the triples contained in an RDF statement.
        </p>
    </n10s-query-form>
</template>

<script>
import { formats, url } from '../constants'
import CypherComponent from '@/components/CypherComponent'

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