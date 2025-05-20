// @ts-nocheck

import { readDataset } from "$lib/utilities/dataReader";

export const prerender = true;
export async function load() {
    const footprintData = await readDataset('global-footprint.csv');
    return {
        footprintData: footprintData
    }
}