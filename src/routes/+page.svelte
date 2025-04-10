<script>
	// @ts-nocheck
	import profileImg from '$lib/images/shanfan_headshot_sq.jpg';
	import { myLinks } from '$lib/components/MyLinks';
	import VideoBg from '$lib/components/VideoBg.svelte';
</script>

<svelte:head>
	<title>Home</title>
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
		<!-- <a href="/projects">
			<h2 style="font-family: var(--font-cursive); letter-spacing: 0.1em">Come in!</h2>
		</a> -->
		<p>
			With a background in product UX design and agile software development, Shanfan has consulted
			enterprise IT teams on user-centric design process and evidence-based product strategy.
		</p>
		<p>
			Currently focusing on <span class="cursive">information design</span>
			and <span class="cursive">visual storytelling</span>, Shanfan’s work combines graphics,
			illustrations, user experience, and interaction design to make complex information accessible
			and engaging.
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
	}

	.profile {
		max-width: 120px;
		border-radius: 50%;
		border: 5px solid #ffffff;
		box-sizing: border-box;
		z-index: 100;
	}
	.card {
		max-width: 650px;
		padding: 75px 3em 2em 3em;
		margin-top: -75px;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		border-radius: 10px;
		border: 1px solid #000;
	}
	.card p {
		font-size: 1.25rem;
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
