<template>
    <sui-container class="main">
        <slot />

         <sui-form>
            <sui-form-field>
                <label>Query Source</label>
                <sui-dropdown
                    fluid
                    :options="queryTypes"
                    placeholder="Query Type"
                    selection
                    v-model="queryType"
                />
            </sui-form-field>

            <!-- inline -->
            <sui-form-field v-if="queryType == 'local'">
                <label>Import</label>
                <sui-input type="file" accept="text/*" @change="fileChanged" />
            </sui-form-field>

            <sui-form-field v-if="showTextbox">
                <label>Query</label>
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

        <p>&nbsp;</p>

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
import { queryTypes, formats, url, outputFormats } from '../constants';
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
        defaultUrl: {
            type: String,
            default: url
        },
    },
    data: () => ({
        loading: false,
        value: '',
        outputFormats,
        displayAs: outputFormats[0].value,
        queryType: queryTypes[2].value,
        queryTypes,
        formats,
        format: 'Turtle',
        url,
        displayAsFixed: '',
    }),
    mounted() {
        this.url = this.defaultUrl
    },
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