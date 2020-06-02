<template>
    <sui-container>
        <slot />

         <sui-form>
            <sui-form-field>
                <label>{{ queryLabel }} Source</label>
                <sui-dropdown
                    fluid
                    :options="queryTypes"
                    placeholder="Query Type"
                    selection
                    v-model="queryType"
                />
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

            <!-- inline -->
            <sui-form-field v-if="queryType == 'local'">
                <label>Import</label>
                <sui-input type="file" :accept="accept.join(',')" @change="fileChanged" />

                <div class="hint">
                <p>The accepted mime types for <strong v-html="format" /> are:</p>
                    <ul>
                        <li v-for="type in accept" :key="type" v-html="type" />
                    </ul>
                </div>
            </sui-form-field>

            <sui-form-field v-if="showTextbox">
                <label>{{ queryLabel }}</label>
                <textarea v-model="value" />
            </sui-form-field>

            <!-- fetch -->
            <sui-form-field v-if="queryType === 'fetch'">
                <label>URL</label>
                <sui-input
                    type="url"
                    placeholder="URL"
                    icon="server"
                    icon-position="left"
                    v-model="url"
                />
            </sui-form-field>

             <sui-form-field v-if="showDisplayAs">
                <label>Display Results As</label>
                <sui-dropdown
                    fluid
                    :options="outputFormats"
                    selection
                    v-model="displayAs"
                />
            </sui-form-field>

            <sui-button primary :disabled="runDisabled" :loading="loading" @click.prevent="runQuery">
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
            :displayAs="displayAsFixed"
        />
    </sui-container>
</template>

<script>
import { queryTypes, formats, outputFormats } from '../constants';
import CypherComponent from '@/components/CypherComponent'

export default {
    name: 'n10s-query-form',

    mixins: [
        CypherComponent,
    ],

    props: {
        procedure: {
            type: String,
            default: 'n10s.validation.shacl.import',
        },
        showDisplayAs: Boolean,
        buttonText: {
            type: String,
            default: 'Run Query',
        },
        queryLabel: {
            type: String,
            default: 'Query',
        },
    },
    data: () => ({
        loading: false,
        outputFormats,
        queryTypes,
        formats,
        displayAsFixed: '',
    }),
    computed: {
        showTextbox() {
            return (this.queryType === 'inline' || this.queryType === 'local' && this.value)
        },
        cypher() {
            const displayAs = this.showDisplayAs ? `.${this.displayAs}` : ''

            const procedure = `${this.procedure}${displayAs}.${this.procedureType}`
            let value = this.queryType === 'fetch' ? this.url : `\n${this.value.replace("'", "\\'")}\n`

            return `CALL ${procedure}(
  '${value}',
  '${this.format}'
)`
        },
        procedureType() {
            return  this.queryType === 'fetch' ? 'fetch' : 'inline'
        },
        runDisabled() {
            return ( this.queryType === 'fetch' && !this.url ) || ( this.queryType !== 'fetch' && this.value === '' )
        },
        accept() {
            return [ 'text/*', ].concat(  formats.find(f => f.value === this.format).types )
        },
        queryType: {
            get() {
                return this.$store.state.queryType
            },
            set(value) {
                return this.$store.commit('setQueryType', value)
            },
        },
        displayAs: {
            get() {
                return this.$store.state.displayAs
            },
            set(value) {
                return this.$store.commit('setDisplayAs', value)
            },
        },
        url: {
            get() {
                return this.queryLabel == 'SHACL' ? this.$store.state.shaclUrl : this.$store.state.url
            },
            set(value) {
                const mutation = this.queryLabel == 'SHACL' ? 'setShaclUrl' : 'setUrl'
                return this.$store.commit(mutation, value)
            },
        },
        format: {
            get() {
                return this.queryLabel == 'SHACL' ? this.$store.state.shaclFormat :  this.$store.state.format
            },
            set(value) {
                const mutation = this.queryLabel == 'SHACL' ? 'setShaclFormat' : 'setFormat'
                return this.$store.commit(mutation, value)
            },
        },
        value: {
            get() {
                return this.queryLabel == 'SHACL' ? this.$store.state.shaclValue :  this.$store.state.value
            },
            set(value) {
                const mutation = this.queryLabel == 'SHACL' ? 'setShaclValue' : 'setValue'
                return this.$store.commit(mutation, value)
            },
        },
    },
    methods: {
        fileChanged(e) {
            const fr = new FileReader()
            fr.onload = e => {
                this.value = e.target.result
            }

            fr.readAsText(e.target.files[0])
        }
    },
    watch: {
        queryType() {
            if ( this.queryType === 'local' ) {
                this.value = ''
            }
        },
    },
}
</script>

<style>

</style>