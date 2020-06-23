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
            <sui-form-field v-if="queryType === 'fetch' || queryType === 'sparql'">
                <label style="float:left">URL</label>
                <sui-dropdown text="Common SPARQL Services" pointing right style="float:right" v-if="queryType === 'sparql'">
                    <sui-dropdown-menu>
                        <sui-dropdown-item v-for="item in sparqlExamples" :key="item.key" @click.prevent="setUrl(item)">
                            {{ item.text }}
                            <!-- <span class="description" v-html="item.value" /> -->
                        </sui-dropdown-item>
                    </sui-dropdown-menu>
                </sui-dropdown>


                <sui-input
                    type="url"
                    placeholder="URL"
                    icon="server"
                    icon-position="left"
                    v-model="url"
                />
            </sui-form-field>

            <!-- sparql params? -->
            <sui-segment v-if="queryType === 'fetch' || queryType === 'sparql'">
                <p><strong>Request Headers</strong></p>

                <sui-grid :columns="2">
                    <sui-grid-row>
                        <sui-grid-column>
                            <sui-form-field>
                                <sui-checkbox v-model="setAcceptHeader" label="Set Accept Header" />
                            </sui-form-field>
                        </sui-grid-column>
                        <sui-grid-column>
                            <sui-form-field>
                                <label>Authorization</label>

                                <sui-dropdown
                                    v-model="authorizationType"
                                    fluid
                                    :options="authorizationTypes"
                                    selection
                                />

                                <sui-input
                                    v-if="authorizationType != 'none'"
                                    v-model="username"
                                    :placeholder="authorizationType == 'Basic' ? 'Username' : 'Token'"
                                />

                                <sui-input
                                    v-if="authorizationType == 'Basic'"
                                    v-model="password"
                                    placeholder="Password"
                                />
                            </sui-form-field>
                        </sui-grid-column>
                    </sui-grid-row>
                </sui-grid>
            </sui-segment>

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
import { queryTypes, formats, outputFormats, sparqlExamples } from '../constants';
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

        // SPARQL options
        sparqlExamples,
        authorizationTypes: [
            { key: 'none', text: 'None', value: 'none',  },
            { key: 'basic', text: 'Basic', value: 'Basic',  },
            { key: 'bearer', text: 'Bearer', value: 'Bearer',  },
        ],
    }),
    computed: {
        showTextbox() {
            return (this.queryType === 'inline' || this.queryType === 'local' && this.value) || this.queryType === 'sparql'
        },
        cypher() {
            const displayAs = this.showDisplayAs ? `.${this.displayAs}` : ''

            const procedure = `${this.procedure}${displayAs}.${this.procedureType}`
            let value = this.queryType === 'fetch' ? this.url : `\n${this.value.replace(/'/g, "\\'")}\n`

            if ( this.queryType === 'sparql' ) {
                value = `${this.url}${encodeURIComponent(this.value)}`
            }

            return `CALL ${procedure}(
  '${value}',
  '${this.format}' ${this.parameters}
)`
        },
        procedureType() {
            return  this.queryType === 'fetch' || this.queryType === 'sparql' ? 'fetch' : 'inline'
        },
        runDisabled() {
            return ( this.queryType === 'fetch' && !this.url ) || ( this.queryType !== 'fetch' && this.value === '' )
        },
        accept() {
            return [ 'text/*', ].concat(  formats.find(f => f.value === this.format).types )
        },
        acceptHeader() {
            return formats.find(f => f.value === this.format).types[0]
        },
        authorizationHeader() {
            return this.authorizationType === 'Basic'
                ? `Authorization: "Basic ${btoa(`${this.username}:${this.password}`)}"`
                : `Authorizaion: "Bearer ${this.username}"`
        },
        parameters() {
            const headerParams = []
            if ( this.setAcceptHeader ) {
                headerParams.push(`Accept: "${this.acceptHeader}"`)
            }

            if ( this.authorizationType !== 'none' ) {
                headerParams.push(this.authorizationHeader)
            }

            return headerParams.length ? `,\n  { headerParams: { ${headerParams.join(', ')} } }` : '';
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
        setAcceptHeader: {
            get() {
                return this.$store.state.setAcceptHeader
            },
            set(value) {
                return this.$store.commit('setAcceptHeader', value)
            },
        },
        authorization: {
            get() {
                return this.$store.state.authorization
            },
            set(value) {
                return this.$store.commit('setAuthorization', value)
            },
        },
        authorizationType: {
            get() {
                return this.$store.state.authorizationType
            },
            set(value) {
                return this.$store.commit('setAuthorizationType', value)
            },
        },
        username: {
            get() {
                return this.$store.state.username
            },
            set(value) {
                return this.$store.commit('setUsername', value)
            },
        },
        password: {
            get() {
                return this.$store.state.password
            },
            set(value) {
                return this.$store.commit('setPassword', value)
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
        },
        setUrl(selected) {
            this.url = selected.url

            if ( this.queryType === 'sparql' && selected.query && this.value === '' ) this.value = selected.query
            if ( selected.setAcceptHeader !== undefined ) this.setAcceptHeader = selected.setAcceptHeader
            if ( selected.authorizationType !== undefined ) this.authorizationType = selected.authorizationType
        },
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