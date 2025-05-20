<script>
	//@ts-nocheck
	let { data } = $props();
	const projects = data.projectData;
	const dir = '/projects';
	projects.sort((a, b) => b.year - a.year);
</script>

<svelte:head>
	<title>Projects</title>
	<meta
		name="description"
		content="Shanfan Huang's projects: Visual Storytelling, Information Design, UI/UX, Data Visualization, Front-end Development"
	/>
</svelte:head>
<section>
	<h1>Shanfan's Projects</h1>
	<p>
		Good design is invisible. Yes, some designs are loud, head-turning, provocative... and they
		serve their purposes. but ultimately, I think, good designs, the time-tested ones, are
		invisible. They make your life so easy that you barely notice its exisitence. You get to focus
		on your task at hand instead of admiring or complaining about the design.
	</p>
	<p>
		Then, by this definition, good design is hard. Because it asks the designer to lay low, to avoid
		drawing attention. Like a backstage staff in a theater in the black suit, they disapear in the
		backdrop, yet they do everything they can to keep the show going. That's a lot of humility and
		compassion.
	</p>
	<p>-- Shanfan Huang</p>
	<div class="projects-container">
		{#each projects as p}
			<div class="card">
				<div class="image">
					{#if p.vidUrl}
						<video autoplay muted loop playsinline>
							<source src={dir + p.vidUrl} type="video/mp4" />
							<img src={dir + p.imageUrl} alt="Image of {p.title}" />
						</video>
					{:else}
						<img src={dir + p.imageUrl} alt="Image of {p.title}" />
					{/if}
				</div>
				<div class="meta">
					<p class="label">Title</p>
					<h2>
						{#if p.link.startsWith('http')}
							<a href={p.link} target="_blank">{p.title}</a>
						{:else}
							<a href={p.link}>{p.title}</a>
						{/if}
					</h2>
					<p class="label">Overview</p>
					<div class="description">{@html p.description}</div>
					<p class="label">Medium</p>
					<p>{p.medium}</p>
					<p class="label">Tools</p>
					<p>{p.tools}</p>
					{#if p.dataSource}
						<p class="label">Data Source</p>
						<div class="sources">{@html p.dataSource}</div>
					{/if}
					<p class="label">Year</p>
					<p>{p.year}</p>
					<p class="label">Tags</p>
					<div class="tags">
						{#each p.tags as tag}
							<p>{tag}</p>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 0 auto;
		padding: 5em;
		max-width: 64em;
	}

	.card {
		background: white;
		border-radius: 1em;
		padding: 1.5em;
		margin: 3em 0;
		display: grid;
		grid-template-columns: 3fr 2fr;
		gap: 1.5em;
	}

	.card h2 {
		text-transform: lowercase;
		font-size: 2em;
		margin-top: 0;
	}

	.card .image img,
	.card .image video {
		width: 100%;
		border-radius: 0.5em;
	}

	.description,
	.sources {
		margin-bottom: 1em;
	}

	.label {
		font-size: smaller;
		text-transform: uppercase;
		color: var(--color-lighter-blue);
		margin: 0;
	}

	.meta p {
		margin-top: 0;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 1em;
	}

	@media (max-width: 720px) {
		section {
			padding: 2em;
		}
		.card {
			grid-template-columns: 1fr;
		}
	}
</style>
