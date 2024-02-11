// const experts = {
//     e1: [[0.413, 0.343, 0.244], [0.311, 0.465, 0.224], [0.219, 0.188, 0.593]],
//     e2: [[0.299, 0.356, 0.345], [0.413, 0.248, 0.339], [0.116, 0.599, 0.285]],
//     e3: [[0.392, 0.408, 0.200], [0.617, 0.199, 0.184], [0.225, 0.494, 0.281]],
//     e4: [[0.482, 0.301, 0.217], [0.336, 0.362, 0.302], [0.194, 0.310, 0.496]],
//     e5: [[0.455, 0.269, 0.276], [0.272, 0.447, 0.281], [0.224, 0.135, 0.641]],
//     e6: [[0.310, 0.311, 0.379], [0.168, 0.316, 0.516], [0.317, 0.234, 0.449]],
//     e7: [[0.329, 0.523, 0.148], [0.302, 0.461, 0.237], [0.245, 0.201, 0.554]],
//     e8: [[0.629, 0.187, 0.184], [0.564, 0.200, 0.236], [0.247, 0.170, 0.583]],
//     e9: [[0.276, 0.322, 0.402], [0.530, 0.217, 0.253], [0.298, 0.386, 0.316]],
// }

// const experts = {
//     e1: [[0.57, 0.18, 0.25], [0.31, 0.44, 0.25], [0.13, 0.26, 0.61]],
//     e2: [[0.69, 0.21, 0.1], [0.25, 0.53, 0.22], [0.22, 0.21, 0.57]],
//     e3: [[0.35, 0.3, 0.35], [0.72, 0.18, 0.1], [0.15, 0.5, 0.35]],
//     e4: [[0.27, 0.37, 0.36], [0.6, 0.21, 0.19], [0.16, 0.5, 0.34]],
//     e5: [[0.56, 0.23, 0.21], [0.2, 0.54, 0.26], [0.27, 0.24, 0.49]],
// }


const experts = {
    e1: [[0.613, 0.223, 0.164], [0.321, 0.475, 0.204], [0.119, 0.288, 0.593]],
    e2: [[0.299, 0.346, 0.355], [0.513, 0.248, 0.239], [0.136, 0.579, 0.285]],
    e3: [[0.392, 0.308, 0.300], [0.817, 0.099, 0.084], [0.125, 0.594, 0.281]],
    e4: [[0.582, 0.201, 0.217], [0.336, 0.462, 0.202], [0.094, 0.310, 0.596]],
    e5: [[0.555, 0.169, 0.276], [0.292, 0.427, 0.281], [0.124, 0.235, 0.641]],
    e6: [[0.210, 0.411, 0.379], [0.068, 0.316, 0.616], [0.317, 0.334, 0.349]],
    e7: [[0.309, 0.543, 0.148], [0.402, 0.461, 0.137], [0.345, 0.101, 0.554]],
    e8: [[0.729, 0.187, 0.084], [0.264, 0.500, 0.236], [0.227, 0.190, 0.583]],
    e9: [[0.276, 0.322, 0.402], [0.630, 0.217, 0.153], [0.198, 0.489, 0.313]],
}

const cellLengthInChars = 10;
const cellLengthInCharsForCluster = 25;
const precision = 3;
const maxAllowedDistanceCoefficient = 1 / 1.5;

/**
 * @param thought1 {Array<Array<number>>}
 * @param thought2 {Array<Array<number>>}
 * @return number
 * */
const getDistanceBetweenExpertThoughts = (thought1, thought2) => {
    let out = 0;
    for (let i = 0; i < Math.min(thought1.length, thought2.length); i++) {
        const f1 = thought1[i];
        const f2 = thought2[i];
        for (let j = 0; j < Math.min(f1.length, f2.length); j++) {
            out += Math.abs(Number(f1[j]) - Number(f2[j]));
        }
    }
    return out;
}

/**
 * @param experts {{
 *     [e: string]: Array<Array<number>>
 * }}
 * @return Array<Array<number>>
 * */
const getEmptyMatrix = (experts) => {
    const out = [];
    const expertAmount = Object.keys(experts).length;
    for (let i = 0; i < expertAmount; i++) {
        const row = [];
        for (let j = 0; j < expertAmount; j++) {
            row.push(0)
        }
        out.push(row);
    }
    return out;
}

/**
 * @param thoughts {Array<Array<number>>}
 * @return Array<Array<number>>
 * */
const getEmptyMatrixForThoughtsOfSingleExpert = (thoughts) => {
    const out = [];
    for (let i = 0; i < thoughts.length; i++) {
        const row = [];
        for (let j = 0; j < thoughts[i].length; j++) {
            row.push(0)
        }
        out.push(row);
    }
    return out;
}

/**
 * @param experts {{
 *     [e: string]: Array<Array<number>>
 * }}
 * @return Array<Array<number>>
 * */
const buildDistanceMatrix = (experts) => {
    const out = getEmptyMatrix(experts);
    const F = Object.values(experts);
    const expertsAmount = Object.keys(experts).length;
    for (let i = 0; i < expertsAmount; i++) {
        for (let j = 0; j < expertsAmount; j++) {
            if (i === j) {
                continue;
            }
            const distance = getDistanceBetweenExpertThoughts(F[i], F[j]);
            out[i][j] = distance;
            out[j][i] = distance;
        }
    }
    return out;
}

/**
 * @param value {string}
 * @param cellLengthInChars {number}
 * @return string
 * */
const formatMatrixCell = (value, cellLengthInChars) => {
    const numberLength = value.length;
    if (numberLength > cellLengthInChars) {
        throw new Error('Increase cellLengthInChars');
    }
    const lengthDiff = cellLengthInChars - numberLength;
    for (let k = 0; k < lengthDiff; k++) {
        if (k % 2 === 0) {
            value += ' ';
        } else {
            value = ' ' + value;
        }
    }
    return value;
}

/**
 * @param headers {string[]}
 * @param cellLengthInChars {number}
 * @param matrix {Array<Array<number>>}
 * */
const prettyPrintMatrix = (headers, matrix, cellLengthInChars) => {
    const cellDelimiter = '|';
    const out = [];
    const formattedHeaders = headers.map(h => formatMatrixCell(h, cellLengthInChars));
    out.push(formattedHeaders.join(cellDelimiter))
    for (let i = 0; i < matrix.length; i++) {
        const row = [];
        for (let j = 0; j < matrix[i].length; j++) {
            const num = matrix[i][j];
            const formattedAsString = num.toFixed(precision);
            row.push(formatMatrixCell(formattedAsString, cellLengthInChars));
        }
        out.push(row.join(cellDelimiter));
    }
    const joined = out.join('\n');
    console.log(joined);
    console.log('')
}

/**
 * @param headers {string[]},
 * @param sums {Array<number>}
 * @return {{
 *     expert: string,
 *     sum: number,
 * }}
 * */
const getMedianThoughtExpertDto = (headers, sums) => {
    const minimumSum = Math.min(...sums);
    const indexOfMinimumSum = sums.indexOf(minimumSum);
    return {
        expert: headers[indexOfMinimumSum],
        sum: minimumSum,
    };
}

/**
 * @param medianExpertDto {{
 *     expert: string,
 *     sum: number,
 * }}
 * */
const prettyPrintMedianExpertDto = (medianExpertDto) => {
    console.log(`Median expert: ${medianExpertDto.expert}, with sum: ${medianExpertDto.sum.toFixed(precision)}`);
    console.log('')
}

/**
 * @param experts {{
 *     [name: string]: Array<Array<number>>
 * }}
 * @return {{
 *     experts: Array<{
 *          expert: string,
 *      }>,
 *      radius: number,
 * }}
 * */
const getTrustSet = (experts) => {
    const distanceMatrix = buildDistanceMatrix(experts);
    const headers = Object.keys(experts).map((e) => {
        return e.replace('e', 'h');
    })
    const sums = distanceMatrix.map((h) => {
        return h.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    })
    const medianExpertDto = getMedianThoughtExpertDto(headers, sums);
    const medianExpertHeader = medianExpertDto.expert;

    const expertsDeltas = [];
    const indexOfMedianExpert = headers.indexOf(medianExpertHeader);
    const expertNames = Object.keys(experts);
    const medianExpertName = expertNames[indexOfMedianExpert];
    for (let i = 0; i < headers.length; i++) {
        if (i === indexOfMedianExpert) {
            continue;
        }
        const expert = headers[i];
        const indexOfExpertName = expertNames[i];
        const distance = getDistanceBetweenExpertThoughts(experts[indexOfExpertName], experts[medianExpertName]);
        const expertsDelta = {
            distance,
            expert,
        }
        expertsDeltas.push(expertsDelta);
    }
    const sortedDeltas = expertsDeltas.sort((d1, d2) => d1.distance - d2.distance);
    const halfOfDeltas = sortedDeltas.slice(0, Math.round(sortedDeltas.length / 2));
    const radius = Math.max(...(halfOfDeltas.map(d => d.distance)));
    return {
        experts: halfOfDeltas.map(d => ({
            expert: d.expert,
        })),
        radius,
    };
}

/**
 * @param header {string}
 * @param trustSet {{
 *     experts: Array<{
 *          expert: string,
 *      }>,
 *      radius: number,
 * }}
 * */
const prettyPrintTrustSet = (header, trustSet) => {
    console.log(header);
    console.log('');
    trustSet.experts.forEach(e => {
        console.log(`\tExpert: ${e.expert}`)
    });
    console.log(`Trust set radius: ${trustSet.radius.toFixed(precision)}`);
    console.log('');
}

/**
 * @param message {string}
 * */
const printBanner = (message) => {
    const stars = [];
    for (let i = 0; i < message.length + 4; i++) {
        stars.push('*');
    }
    const newMessage = `\t* ${message} *`;
    const starsRow = '\t' + stars.join('');
    const out = ['\n', starsRow, newMessage, starsRow, '\n'];
    console.log(out.join('\n'));
}

/**
 * @param clusters {Array<{
 *         clusterName: string,
 *         expertNames: Set<string>,
 *         thoughts: Array<Array<number>>
 *     }>}
 * @return {{
 *     clusters: Set<{
 *         clusterName: string,
 *         expertNames: Set<string>,
 *         thoughts: Array<Array<number>>
 *     }>,
 *     distance: number,
 * }}
 */
const getClustersWithMinimumDistanceBetweenThoughts = (clusters) => {
    const deltas = new Map();
    for (let i = 0; i < clusters.length; i++) {
        for (let j = 0; j < clusters.length; j++) {
            if (i === j) {
                continue;
            }
            const distance = getDistanceBetweenExpertThoughts(clusters[i].thoughts, clusters[j].thoughts);
            const distanceAsKey = distance.toFixed(precision);
            let existing = deltas.get(distanceAsKey);
            if (!existing) {
                existing = new Set();
                deltas.set(distanceAsKey, existing);
            }
            existing.add(clusters[i]);
            existing.add(clusters[j]);
        }
    }
    const minimumKey = Array.from(deltas.keys())
        .sort((k1, k2) => Number(k1) - Number(k2))
        .slice(0, 1);
    return {
        clusters: deltas.get(minimumKey[0]),
        distance: Number(minimumKey)
    };
}

/**
 * @param experts {{
 *     [e: string]: Array<Array<number>>
 * }}
 * @param clusters {Array<{
 *         clusterName: string,
 *         expertNames: Set<string>,
 *         thoughts: Array<Array<number>>
 *     }>}
 * @return {{
 *         clusterName: string,
 *         expertNames: Set<string>,
 *         thoughts: Array<Array<number>>
 *     }}
 */
const mergeClusters = (experts, clusters) => {
    const clusterName = clusters.reduce((previousValue, currentValue) => {
        if (!previousValue) {
            return currentValue.clusterName;
        }
        return `${previousValue}, ${currentValue.clusterName}`;
    }, '');

    const expertNames = new Set();
    for (const c of clusters) {
        for (const name of Array.from(c.expertNames)) {
            expertNames.add(name);
        }
    }

    const thoughts = getEmptyMatrixForThoughtsOfSingleExpert(Object.values(experts)[0]);
    for (const c of clusters) {
        for (const name of Array.from(c.expertNames)) {
            const expertThoughts = experts[name];
            for (let i = 0; i < expertThoughts.length; i++) {
                for (let j = 0; j < expertThoughts[i].length; j++) {
                    thoughts[i][j] = thoughts[i][j] + expertThoughts[i][j];
                }
            }
        }
    }
    const amountOfMergedExperts = expertNames.size;
    for (let i = 0; i < thoughts.length; i++) {
        for (let j = 0; j < thoughts[i].length; j++) {
            thoughts[i][j] = thoughts[i][j] / amountOfMergedExperts;
        }
    }

    return {
        clusterName,
        thoughts,
        expertNames,
    }
}

const mapExpertsToClusters = (experts) => {
    return Object.keys(experts).map(e => ({
        clusterName: String(e),
        expertNames: new Set([String(e)]),
        thoughts: experts[e],
    }));
}

const mapClustersToExperts = (clusters) => {
    const newExperts = {}
    clusters.forEach(c => {
        newExperts[c.clusterName] = c.thoughts;
    })
    return newExperts;
}

const getMaxAllowedThoughtDistance = (trustedSet) => {
    return trustedSet.radius * maxAllowedDistanceCoefficient;
}

/**
 * @param experts {{
 *     [e: string]: Array<Array<number>>
 * }}
 * @param clusters {Array<{
 *         clusterName: string,
 *         expertNames: Set<string>,
 *         thoughts: Array<Array<number>>
 *     }>}
 * @param maxAllowedDistance {number}
 * @return {Array<{
 *         clusterName: string,
 *         thoughts: Array<Array<number>>
 *     }>}
 */
const clusterizeRecursively = (experts, clusters, maxAllowedDistance) => {
    const closestClustersDto = getClustersWithMinimumDistanceBetweenThoughts(clusters);
    if (!closestClustersDto.clusters || closestClustersDto.distance > maxAllowedDistance) {
        return clusters;
    }
    const clustersAsArray = Array.from(closestClustersDto.clusters);
    const newCluster = mergeClusters(experts, clustersAsArray);
    const newClusters = clusters.filter(c => clustersAsArray.find(unitedCluster => unitedCluster.clusterName === c.clusterName) === undefined);
    const indexOfLastCluster = clusters.findIndex(c => c.expertNames.size !== 1);
    if (indexOfLastCluster === -1) {
        newClusters.unshift(newCluster);
    } else {
        const indexOfThisCluster = clusters.findIndex(c => newCluster.clusterName.startsWith(c.clusterName));
        if (indexOfThisCluster === -1) {
            newClusters.splice(indexOfLastCluster, 0, newCluster);
        } else {
            newClusters.splice(indexOfThisCluster, 0, newCluster);
        }
    }

    const newClustersAsExperts = mapClustersToExperts(newClusters);
    const newTrustedSet = getTrustSet(newClustersAsExperts);
    const newMaxAllowedDistance = getMaxAllowedThoughtDistance(newTrustedSet);

    return clusterizeRecursively(experts, newClusters, newMaxAllowedDistance);
}

/**
 * @param experts {{
 *     [e: string]: Array<Array<number>>
 * }}
 * @return {{
 *      clusterNames: string[],
 *      clusters: Array<{
 *         clusterName: string,
 *         thoughts: Array<Array<number>>
 *     }>
 * }}
 */
const clusterize = (experts) => {
    const trustSet = getTrustSet(experts);
    const maxAllowedDistance = getMaxAllowedThoughtDistance(trustSet);
    const expertsAsClusters = mapExpertsToClusters(experts);
    const clusters = clusterizeRecursively(experts, expertsAsClusters, maxAllowedDistance);

    return {
        clusterNames: clusters.map(c => c.clusterName),
        clusters,
    }
}

const prettyPrintExperts = (experts) => {
    for (const name of Object.keys(experts)) {
        console.log(`Expert(s): ${name}`);
        const thoughts = experts[name];
        prettyPrintMatrix([], thoughts, cellLengthInCharsForCluster);
    }
}

const main = () => {
    printBanner('Experts thoughts')
    prettyPrintExperts(experts);

    const distanceMatrix = buildDistanceMatrix(experts);
    const headers = Object.keys(experts).map((e) => {
        return e.replace('e', 'h');
    })
    prettyPrintMatrix(headers, distanceMatrix, cellLengthInChars);

    const sums = distanceMatrix.map((h) => {
        return h.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    })
    const sumHeaders = headers.map(h => `Sum ${h}`);
    prettyPrintMatrix(sumHeaders, [sums], cellLengthInChars);

    const medianExpertDto = getMedianThoughtExpertDto(headers, sums);
    prettyPrintMedianExpertDto(medianExpertDto);

    const trustSet = getTrustSet(experts);
    prettyPrintTrustSet('Trust set:', trustSet);

    printBanner('Started clustering...')

    const clustersDto = clusterize(experts);

    const newExperts = mapClustersToExperts(clustersDto.clusters);
    const newDistanceMatrix = buildDistanceMatrix(newExperts);

    printBanner('New experts thoughts')
    prettyPrintExperts(newExperts);

    printBanner('New experts distance matrix')
    prettyPrintMatrix(clustersDto.clusterNames, newDistanceMatrix, cellLengthInCharsForCluster);
    const clusterSums = newDistanceMatrix.map((h) => {
        return h.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    })
    const clusterSumHeaders = clustersDto.clusterNames.map(h => `Sum ${h}`);
    prettyPrintMatrix(clusterSumHeaders, [clusterSums], cellLengthInCharsForCluster);
}

main();
