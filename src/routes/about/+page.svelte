<script>
	// @ts-nocheck
	import profileImg from '$lib/images/shanfan_headshot_sq.jpg';
	import { myLinks } from '$lib/components/MyLinks';
	import VideoBg from '$lib/components/VideoBg.svelte';
</script>

<svelte:head>
	<title>About</title>
	<meta
		name="description"
		content="Shanfan Huang: Visual Storytelling, Information Design, UI/UX, Data Visualization, Front-end Development"
	/>
</svelte:head>

<section>
	<VideoBg />
	<img class="profile" src={profileImg} alt="shanfan huang profile" />
	<div class="card">
		<h1 style="text-align: center">Shanfan Huang</h1>
		<h2 style="font-weight: 100; text-align: center">
			Design is a way of thinking, identifying patterns, telling stories, and revealing new
			perspectives.
		</h2>
		<a href="/">
			<h2 class="cursive" style="text-align: center">Come in!</h2>
		</a>
		<p>
			Shanfan Huang is a designer who bridges data and story, logic and intuition. With a background
			in product UX design and agile software consulting, she has coached enterprise IT teams on
			user-centric design methodology, user research, and evidence-based product strategy.
		</p>
		<p>
			Now working in data visualization, she applies the same rigorous thinking — hypothesis →
			evidence → insights → takeaways — while considering usability and user experience.
		</p>

		<p>
			Working across print and web, illustration and code, Shanfan’s work always has the same goal:
			<span class="cursive">
				making ideas easier to see, and helping people orient, reflect, and reimagine.
			</span>
		</p>

		<div class="link-container">
			<div class="icon-links">
				<p class="icon-header">creative</p>
				<div class="icon-container">
					{#each myLinks as link}
						{#if link.type === 'creative'}
							<a href={link.url} target="_blank">
								<img src={link.src} alt={link.id} title={link.title} />
							</a>
						{/if}
					{/each}
				</div>
			</div>
			<div class="icon-links">
				<p class="icon-header">social</p>
				<div class="icon-container">
					{#each myLinks as link}
						{#if link.type === 'social'}
							<a href={link.url} target="_blank">
								<img src={link.src} alt={link.id} title={link.title} />
							</a>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
		color: white;
		padding: 0 1em;
	}

	.profile {
		max-width: 120px;
		border-radius: 50%;
		border: 5px solid var(--color-lightest-blue);
		box-sizing: border-box;
		z-index: 100;
	}
	.card {
		max-width: 650px;
		padding: 75px 3em 2em 3em;
		margin-top: -75px;
		background: rgba(4, 3, 56, 0.5);
		backdrop-filter: blur(4px);
		border-radius: 10px;
		border: 1px solid var(--color-lightest-blue);
	}
	.card p {
		font-size: 1.25rem;
		font-weight: 100;
	}
	.link-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.link-container img {
		width: 40px;
	}
	.icon-links {
		text-align: center;
		width: 45%;
	}

	.icon-links a {
		opacity: 0.5;
	}

	.icon-links a:hover {
		opacity: 1;
	}

	.icon-header {
		color: #222;
		background-color: #ffffff;
		font-size: 1em;
		text-transform: uppercase;
		letter-spacing: 0.5em;
		font-weight: 400;
		border-radius: 4px;
		opacity: 0.5;
	}
	.icon-container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		align-items: center;
		justify-items: center;
	}
	@media (max-width: 500px) {
		.link-container {
			flex-direction: column;
		}
		.link-container > * {
			width: 100%;
		}

		.icon-container img {
			width: 48px;
		}
	}
</style>
