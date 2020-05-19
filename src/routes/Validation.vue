<template>
    <div>
        <n10s-query-form
            :defaultUrl="url"
            buttonText="Load Constraints"
            procedure="n10s.validation.shacl.import"
            queryLabel="SHACL"
        >
            <h1 is="sui-header">Validating Neo4j graphs against SHACL</h1>

            <p>Use the W3C standard Shapes Constraint Language (SHACL) to define constraints for your Neo4j graph.</p>
        </n10s-query-form>

        <sui-container>
            <h2>Running Validation</h2>
            <p>Once you have created the shapes for your graph, you can run the following query to run the shacl validation on the whole graph:</p>

            <n10s-cypher-tabs
                previewTitle="Query"
                buttonText="Run Validation"
                :cypher="validationCypher"
                :result="validationResults"
                :tab="validationTab"
            >
                <sui-message negative v-if="error">{{ error }}</sui-message>
                <sui-button primary @click.prevent="runValidation">Run Validation</sui-button>
            </n10s-cypher-tabs>
        </sui-container>
    </div>
</template>

<script>
/* eslint-disable */
import { queryTypes, formats, shaclUrl, } from '../constants';
import CypherComponent from '../components/CypherComponent'

export default {
    mixins: [ CypherComponent, ],
    data: () => ({
        url: shaclUrl,

        validationResults: false,
        validationCypher: 'CALL n10s.validation.shacl.validate()',
        validationTab: 0,
    }),
    methods: {
        runValidation() {
            this.loading = true

            this.$neo4j.run(this.validationCypher)
                .then(res => {
                    this.validationResults = res
                    this.validationTab = 1
                })
                .catch(e => this.error = e)
                .finally(() => this.loading = false)
        },
    },
}
</script>

<style>

</style>