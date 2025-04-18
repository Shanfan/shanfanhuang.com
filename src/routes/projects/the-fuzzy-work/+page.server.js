// @ts-nocheck

import { fetchDataset } from "$lib/dataLoader";
import { ascending, rollup, sum, max, descending } from 'd3';

export async function load({ fetch }) {
    const proj = "/the-fuzzy-work/"

    const [industryRelationships, layoffEvents] = await Promise.all([
        fetchDataset(proj + 'IndustryRelationships.csv', fetch),
        fetchDataset(proj + 'TechLayoffs.csv', fetch)
    ]);

    const filteredEvents = layoffEvents.filter(d => d.layoff != null)

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
            filteredEvents,
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
            (v) => {
                return {
                    companies: v.length,
                    bankrupted: v.filter(d => d.percentage === 100).length,
                    ppl_laidoff: sum(v, d => d.layoff)
                }
            },
            (d) => d.industry
        );

        const industryCountsArray = Array.from(
            industryCounts,
            ([industry, counts]) => ({ industry, ...counts })
        );

        industryCountsArray.sort((a, b) => descending(a.ppl_laidoff, b.ppl_laidoff));

        return industryCountsArray;
    }

    return {
        layoffByCompany: layoffByCompany,
        relationships: industryRelationships,
        industries: getAllIndustries(),
    }
}