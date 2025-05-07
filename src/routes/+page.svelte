<script>
	//@ts-nocheck
	let { data } = $props();
	const projects = data.projectData;
	console.log(projects);
</script>

<svelte:head>
	<title>Projects</title>
	<meta
		name="description"
		content="Shanfan Huang's projects: Visual Storytelling, Information Design, UI/UX, Data Visualization, Front-end Development"
	/>
</svelte:head>
<section>
	<h1>Shanfan's Work</h1>
	<div class="container">
		<a href="/the-fuzzy-work">The Fuzzy Work</a>
		{#each projects as p}
			{p.title}
		{/each}
	</div>
</section>

<style>
	section {
		display: flex;
		flex: 0.1;
		flex-direction: column;
		justify-content: center;
		margin: 0 auto;
	}
</style>
