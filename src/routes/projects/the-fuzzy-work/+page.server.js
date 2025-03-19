// @ts-nocheck

import { fetchDataset } from "$lib/dataLoader";

export async function load({ fetch }) {
    const industryRelationships = await fetchDataset("the-fuzzy-work/IndustryRelationships.csv", fetch)
    return { relationships: industryRelationships }
}