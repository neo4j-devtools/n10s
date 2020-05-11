<template>
    <div class="n10s-result">
        <sui-table compact striped v-if="!noResults && isTable">
            <sui-table-header>
                <sui-table-header-cell v-for="key in headers" :key="key">{{ key }}</sui-table-header-cell>
            </sui-table-header>
            <sui-table-body>
                <sui-table-row v-for="(record, index) in result.records" :key="index">
                    <sui-table-cell v-for="key in headers" :key="index+key">
                        {{ record.get(key) }}
                    </sui-table-cell>
                </sui-table-row>
            </sui-table-body>
        </sui-table>

        <graph-result v-if="!noResults && !isTable"
            :result="result"
        />

        <p class="ui tiny" v-if="summary" v-html="summary" />
    </div>
</template>

<script>
import GraphResult from './GraphResult'

export default {
    name: 'n10s-result',
    props: {
        result: Object,
        displayAs: {
            type: String,
            default: 'table',
        },
    },
    components: {
        GraphResult,
    },
    computed: {
        isTable() {
            return this.displayAs !== 'preview'
        },
        noResults() {
            return this.result && !this.result.records.length
        },
        headers() {
            return this.result.records[0].keys
        },
        summary() {
            const consumed = this.result.summary.resultConsumedAfter.toNumber()
            const available = this.result.summary.resultAvailableAfter.toNumber()

            return `Started streaming ${this.result.records.length} record${this.result.records.length === 1 ? '' : 's'} after ${available}ms and completed after ${consumed}ms`
        },
    },
}
</script>