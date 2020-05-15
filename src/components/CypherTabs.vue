<template>
    <sui-tab class="cypher-tabs" :active-index="tab">
        <sui-tab-pane title="Preview Cypher">
            <pre v-html="cypher" />
        </sui-tab-pane>
        <sui-tab-pane title="Results">
            <div class="results">
                <sui-loader :active="loading" centered inline />

                <sui-message negative v-if="!loading && error" header="Error Running Query" :content="error.message" />

                <n10s-result v-else-if="!loading && result" :result="result" :displayAs="displayAs" />
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
        loading: Boolean,
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
