<template>
    <sui-container class="main">
        <h1 is="sui-header">n10s</h1>

        <Asciidoc file="./docs/_introduction.adoc " />


        <!-- <p>NSMNTX is a plugin that enables the <span class="strong"><strong>use of RDF in Neo4j</strong></span>. <a class="link" href="https://www.w3.org/RDF/" target="_top">RDF is a W3C standard model</a> for data interchange.
            This effectively means that NSMNTX makes it possible to
        </p>
        <div class="itemizedlist">
            <ul class="itemizedlist" style="list-style-type: disc; ">
                <li class="listitem"><span class="strong"><strong>Store RDF data in Neo4j</strong></span> in a
                    lossless manner (imported RDF can subsequently be exported without losing a single triple in the process).
                </li>
                <li class="listitem">On-demand <span class="strong"><strong>export property graph data</strong></span> from Neo4j <span class="strong"><strong>as RDF</strong></span>.
                </li>
            </ul>
        </div>
        <p>Other features in NSMNTX include <span class="strong"><strong>model mapping</strong></span> and <span class="strong"><strong>inferencing</strong></span> on Neo4j graphs.</p>

        <Asciidoc /> -->
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