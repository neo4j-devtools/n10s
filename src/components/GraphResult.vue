<template>
    <div class="forced">
        <div class="graph">{{ result }}</div>

        <sui-card class="selected" v-if="selectedNode">
            <sui-card-content>
                <sui-card-header>
                    <sui-icon class="right aligned" name="close" @click.prevent="closeSelected" />
                    <sui-label v-for="label in selectedNode.labels" :key="label">
                        {{ label }}
                    </sui-label>

                </sui-card-header>
            </sui-card-content>
            <sui-card-content>
                <div class="ui list">
                    <div class="item" v-for="(value, key) in selectedNode.properties" :key="key">
                        <div class="header" v-html="key" />
                        {{ value }}
                    </div>
                </div>

            </sui-card-content>
        </sui-card>
    </div>
</template>

<script>
/* eslint-disable */
import vis from 'visjs-network'

import { resultToNodes, resultToEdges, } from '../utils'

export default {
    props: {
        result: null,
    },
    mounted() {
        this.renderGraph()
    },
    data: () => ({
        nodes: [],
        edges: [],
        selectedNode: false,
        selectedRelationship: false,
    }),
    methods: {
        closeSelected() {
            this.selectedNode = false
            this.selectedRelationship = false
        },
        toNode(value) {
            return {
                id: value.identity.toNumber(),
                label: value.labels.join(':'),

                ...value,
            }
        },
        toRelationship(value) {
            return {
                from: value.start.toNumber(),
                to: value.end.toNumber(),
                id: value.identity.toNumber(),
                label: value.type,

                ...value,
            }
        },
        renderGraph() {
            const container = this.$el.querySelector(".graph");

            this.nodes = resultToNodes(this.result)
            this.edges = resultToEdges(this.result)

            // provide the data in the vis format
            const data = {
                nodes: this.nodes,
                edges: this.edges,
            };
            const options = {
                nodes: {
                    shape: 'dot',
                    size: 16,
                    color: '#2185d0',
                    font: {
                        color: '#2185d0',
                    },
                },
                layout:{
                    randomSeed: 34
                },
                edges: {
                    arrows: 'to',
                    font: {
                        size: 10,
                        color: 'rgba(0,0,0,.6)'
                    },
                    color: {
                        color: '#A5ABB6',
                        hover: '#A5ABB6',
                        highlight: '#A5ABB6'
                    },
                },
            };

            // initialize your network!
            this._network = new vis.Network(container, data, options);

            this._network.on("click", params => {
                this.selected = false

                if ( params.nodes.length ) this.selectedNode = this.nodes.find(node => node.identity.toNumber() === params.nodes[0])
                else if ( params.edges.length ) this.selectedRelationship = this.edges.find(rel => rel.identity.toNumber() === params.edges[0])
            })
        },
    },
    watch: {
        result() {
            this.renderGraph()
        },
    },
}
</script>
