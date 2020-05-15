<template>
    <n10s-query-form
        :defaultUrl="url"
        buttonText="Load Constraints"
        procedure="n10s.validation.shacl.import"
        queryLabel="SHACL"
    >
        <h1 is="sui-header">Validating Neo4j graphs against SHACL</h1>

        <p>Use the W3C standard Shapes Constraint Language (SHACL) to define constraints for your Neo4j graph.</p>
    </n10s-query-form>
</template>

<script>
/* eslint-disable */
import { queryTypes, formats, shaclUrl, } from '../constants';
import CypherComponent from '../components/CypherComponent'

export default {
    mixins: [ CypherComponent, ],
    data: () => ({
        loading: false,
        url: shaclUrl,
    }),
}
</script>

<style>

</style>