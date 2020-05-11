<template>
    <div v-html="content" />
</template>

<script>
/* eslint-disable */
import asciidoctor from 'asciidoctor'


export default {
    props: {
        file: String,
    },
    data: () => ({
        loading: true,
        error: undefined,
        content: undefined,
    }),
    mounted() {
        fetch(this.file)
            .then(res => res.text())
            .then(text => asciidoctor().convert(text))
            .then(doc => this.content = doc)
            .then(() => {
                // Open Links in new page
                Array.from(this.$el.querySelectorAll('a[href^="http"]'))
                    .forEach(a => a.setAttribute('target', '_blank'))
            })
            .catch(e => {
                console.log(e);

                this.error = e
                this.content = `<div class="ui negative message">${e}</div>`
            })
    },
}
</script>

<style>

</style>