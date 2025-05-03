<script>
	import '$lib/components/blog.css';
	import process from './components/ process.svg';
</script>

<svelte:head>
	<title>The Making of The Fuzzy Work</title>
	<meta
		name="description"
		content="The case study shares how Shanfan created the interactive charts in The Fuzzy Work while analysing the layoff data from layoffs.fyi."
	/>
</svelte:head>

<div class="grid">
	<header class="full-width">
		<h1><span>behind_the_scens_of</span> the fuzzy work</h1>

		<div class="hero">
			<img
				src={process}
				alt="Design process diagram showing a variety of activities involved in the making of The Fuzzy Work"
			/>
			<p>
				The design process of <a href="/the-fuzzy-work">the interactive visual essay</a> that explores
				public data of tech layoffs between 2020 and 2025.
			</p>
		</div>
	</header>
	<section>
		<h2>Context</h2>
		<p>
			As we enter the 5th year since COVID-19, the world feels a lot different than what it was
			before. Many people left their previous jobs, either voluntarily or involuntarily, to pursue
			something different in life, including myself. Having worked in the tech industry for most of
			my career, I’m intrigued by the shifting landscape of this industry. The dataset from
			<a href="https://layoffs.fyi" target="_blank">layoffs.fyi</a>, compiled by
			<a href="https://www.rogerlee.com/" target="_blank">Roger Lee</a>, which tracks tech layoff
			announcements reported by major news outlets, became a starting point for this analysis.
		</p>
		<h2>Analysis & Exploration</h2>
		<p>
			When I receive a dataset, my first step is to understand the broader context implied by the
			labels used in the dataset. After initial research and scoping, I decided not to focus on the
			announcement dates or geographic locations. Instead, I treated the 5-year period as a cohesive
			whole, aiming to uncover shifts in industries and startups during this unique turning point of
			history. To do this, I aggregated layoff announcements by company and explored correlations
			across different sectors.
		</p>
	</section>
</div>

<style>
	.hero {
		position: relative;
	}
	header p {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, 0);
		max-width: 30em;
		padding: 0 1em;
	}

	@media (max-width: 730px) {
		header p {
			position: unset;
			transform: translate(0, 0);
			margin: 0 auto;
		}
	}
</style>
