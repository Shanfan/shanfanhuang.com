import projectData from '$lib/data/projects.yaml'

export const prerender = true;

export function load() {
    return {
        projects: projectData,
        pageBg: "var(--color-light-bg)",
        theme: "dark"
    };
}