<template>
    <pre :class="language"><code ref="code" :class="language" v-html="cleanedCode" /></pre>
</template>

<script>
/* eslint-disable */
import hljs from 'highlightjs'

export default {
    name: 'CodeBlock',
    props: {
        language:{
            type: String,
            default: 'cypher',
        },
        code: String,
    },
    mounted() {
        hljs.highlightBlock(this.$el)
    },
    computed: {
        cleanedCode() {
            return this.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        },
    },
    watch: {
        code() {
            Array.from(this.$el.children).forEach(el => this.$el.removeChild(el))

            const code = document.createElement('code')
            code.setAttribute('class', this.language)
            code.innerHTML = this.cleanedCode

            this.$el.appendChild(code)
            this.$refs.code = code

            hljs.highlightBlock(this.$el)
        },
    },
}
</script>