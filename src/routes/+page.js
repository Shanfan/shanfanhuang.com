import { dev } from '$app/environment';
import projectData from '$lib/data/projects.yaml'

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

export function load() {
    return {
        projects: projectData,
        pageBg: "var(--color-light-bg)",
        theme: "dark"
    };
}