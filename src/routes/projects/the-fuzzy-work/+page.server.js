// @ts-nocheck

import { fetchDataset } from "$lib/dataLoader";
import { ascending, rollup, sum, max } from 'd3';

export async function load({ fetch }) {
    const proj = "/the-fuzzy-work/"

    // Promise.all allows both file reads to proceed simultaneously, rather than
    // sequentially. A small performance optimization.
    const [industryRelationships, layoffEvents] = await Promise.all([
        fetchDataset(proj + 'IndustryRelationships.csv', fetch),
        fetchDataset(proj + 'TechLayoffs.csv', fetch)
    ]);

    // Public: Post-IPO.
    // Unknown: Companies labeled as “Unknown” or “null” in the original dataset.
    // Private: Includes companies that are "Acquired", "Subsidiary", or "Private Equity".
    // Early Stage: Companies in the Seed, Series A, or Series B funding rounds.
    // Mid Stage: Companies in Series C or Series D funding rounds.
    // Late Stage: Companies in Series E through Series J funding rounds.

    const simplifyStage = (stage) => {
        switch (stage) {
            case "Post-IPO":
                return "Public";
            case "Acquired":
            case "Subsidiary":
            case "Private Equity":
                return "Private"
            case "Unknown":
            case null:
                return "Unknown";
            case "Seed":
            case "Series A":
            case "Series B":
                return "Early Stage";
            case "Series C":
            case "Series D":
                return "Mid Stage";
            default:
                return "Late Stage";
        }
    }

    const layoffByCompany = Array.from(
        rollup(
            layoffEvents,
            (v) => {
                const totalLayoff = sum(v, d => d.layoff);
                const maxPercent = max(v, d => parseFloat(d.percentage));
                const { stage, industry } = v[0];
                return {
                    layoff: totalLayoff,
                    percentage: maxPercent,
                    stage: simplifyStage(v[0].stage),
                    industry,
                    events: v.map((d) => {
                        return {
                            date: d.date,
                            layoff: d.layoff,
                            percentage: d.percentage,
                            location: d.location,
                            country: d.country
                        }
                    })
                };
            },
            (d) => d.company
        ),
        ([company, values]) => ({ company, ...values })
    );

    const getAllIndustries = () => {
        const industryCounts = rollup(
            layoffByCompany,
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
        layoffByCompany: layoffByCompany,
        relationships: industryRelationships,
        industries: getAllIndustries(),
    }
}