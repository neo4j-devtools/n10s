<template>
    <n10s-query-form
        :defaultUrl="url"
        buttonText="Load Constraints"
        procedure="n10s.validation.shacl.import"
    >
        <h1 is="sui-header">Validating Neo4j graphs against SHACL</h1>

        <p>Neosemantics uses the W3C standard Shapes Constraint Language (SHACL) as the formalism to describe such graph constraints. In v.4 we cover a significant portion of the SHACL language but not all. The elements not implemented yet will be added gradually and changes will be reflected in this manual.</p>

        <h2 is="sui-header">Loading the model constraints</h2>



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