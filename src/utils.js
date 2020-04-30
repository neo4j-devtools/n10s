/* eslint-disable */
import { types } from 'neo4j-driver'


export const resultToNodes = result => {
    return result.records.map(row => {
        return row.keys.map(key => {
            const value = row.get(key)

            if ( isNode(value) ) {
                return [ toNode(value) ]
            }
            else if ( Array.isArray(value) ) {
                return arrayToNodes(value)
            }

            return []
        }).reduce((acc, val) => acc.concat(val), [])
    }).reduce((acc, arr) => {
        return acc.concat( arr.filter(val => !acc.includes(val)) )
    }, [])

}

const arrayToNodes = row => {
    return row.filter(value => value && value.labels)
        .map(toNode)
}

export const resultToEdges = result => {
    return result.records.map(row => {
        return row.keys.map(key => {
            const value = row.get(key)

            if ( isRelationship(value) ) {
                return [ toEdge(value) ]
            }
            else if ( Array.isArray(value) ) {
                return arrayToEdges(value)
            }

            return []
        }).reduce((acc, val) => acc.concat(val), [])
    }).reduce((acc, arr) => {
        return acc.concat( arr.filter(val => !acc.includes(val)) )
    }, [])
}

const arrayToEdges = row => {
    return row.filter(value => isRelationship(value))
        .map(toEdge)
}

const isNode = value => value && value.labels && value.identity
const isRelationship = value => value && value.type && value.identity

const toNode = value => ({
    id: value.identity.toNumber(),
    label: value.labels.join(':'),

    ...value,
})

const toEdge = value => ({
    from: value.start.toNumber(),
    to: value.end.toNumber(),
    id: value.identity.toNumber(),
    label: value.type,

    ...value,
})