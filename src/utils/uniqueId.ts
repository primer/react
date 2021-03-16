let idSeed = 10000
export function uniqueId(): string {
    return `__primer_id_${idSeed++}`
}