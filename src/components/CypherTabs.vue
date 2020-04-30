<template>
  <sui-tab :active-index="tab">
        <sui-tab-pane title="Preview Cypher">
            <pre v-html="cypher" />
        </sui-tab-pane>
        <sui-tab-pane title="Results">
            <div class="results">
                <sui-message negative v-if="error" header="Error Running Query" :content="error.message" />

                <n10s-result v-else-if="result" :result="result" :displayAs="displayAs" />
                <p v-else>Click <strong>&lt; {{ buttonText }} &gt;</strong> to run your query.</p>
            </div>
        </sui-tab-pane>
    </sui-tab>
</template>

<script>
import n10sResult from './Result'

export default {
    components: {
        n10sResult,
    },
    props: {
        tab: Number,
        cypher: {
            type: String,
        },
        params: {
            type: Object,
            default: () => ({}),
        },
        result: null,
        error: null,
        buttonText: {
            type: String,
            default: 'Run Query'
        },
        /**
         * Type of result (graph or table)
         */
        displayAs: {
            type: String,
            default: 'table'
        }
    },
}
</script>

<style>

</style>