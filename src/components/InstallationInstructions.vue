<template>
    <div>
        <p class="header">Installation Instructions</p>
        <p>
            You can either download a prebuilt jar from the
            <a href="https://github.com/neo4j-labs/neosemantics/releases" target="_blank">releases area</a>
            or build it from the source.
        </p>

        <ol>
            <li>Copy the the jar(s) in the <code>&lt;NEO_HOME&gt;/plugins</code> directory of your Neo4j instance.
            (note: If you're going to use the JSON-LD serialisation format for RDF, you'll need to include also APOC)</li>
            <li>
                Add the following line to your <code>&lt;NEO_HOME&gt;/conf/neo4j.conf</code>:

                <pre>dbms.unmanaged_extension_classes=n10s.endpoint=/rdf</pre>
            </li>
            <li>Restart the server.</li>
            <li>Click <strong>&lt; I have installed the plugin &gt;</strong></li>
        </ol>

    </div>
</template>