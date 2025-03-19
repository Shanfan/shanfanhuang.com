// @ts-nocheck

import { fetchDataset } from "$lib/dataLoader";
import { ascending, rollup } from 'd3';

export async function load({ fetch }) {
    const proj = "the-fuzzy-work/"
    const industryRelationships = await fetchDataset(proj + "IndustryRelationships.csv", fetch);
    const layoffs = await fetchDataset(proj + 'TechLayoffs.csv', fetch);

    const getAllIndustries = () => {
        const industryCounts = rollup(
            layoffs,
            (v) => v.length,
            (d) => d.industry
        );

        const industryCountsArray = Array.from(
            industryCounts,
            ([industry, count]) => ({ industry, count })
        );

        industryCountsArray.sort((a, b) => ascending(a.industry, b.industry));

        return industryCountsArray;
    }


    return {
        layoffs: layoffs,
        relationships: industryRelationships,
        industries: getAllIndustries(),
    }
}