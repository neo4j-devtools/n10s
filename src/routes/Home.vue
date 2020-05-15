<template>
    <sui-container>
        <h1 is="sui-header">n10s</h1>

        <Asciidoc file="./asciidoc/_introduction.adoc " />
    </sui-container>
</template>

<script>
import Asciidoc from '../components/Asciidoc'

export default {
    name: 'home',
    components: {
        Asciidoc,
    },
}
</script>