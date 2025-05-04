<script>
	//@ts-nocheck
	import '$lib/components/blog.css';
	import process from './components/process.svg';
	import relationTable from './components/industry_relationships.png';
	import StageGrouping from './components/StageGrouping.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	let breakoutWidth = $state();
	let normalWidth = $state();

	const rollupSnippet = `
const layoffByCompany = Array.from(
	rollup(
		layoffData,
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
);`;
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
		<h2>Background</h2>
		<p>
			As we enter the 5th year since COVID-19, the world feels a lot different than what it was
			before. Many people left their previous jobs, either voluntarily or involuntarily, to pursue
			something different in life, including myself. Having worked in the tech industry for most of
			my career, I’m intrigued by the shifting landscape of this industry. The dataset from
			<a href="https://layoffs.fyi" target="_blank">layoffs.fyi</a> that tracks tech layoff announcements
			reported by major news outlets, became a starting point for this analysis.
		</p>
		<h2>Analysis & Exploration</h2>
		<p>
			When I receive a dataset, my first step is to understand the broader context implied by the
			labels used in the dataset. After initial research and scoping, I decided not to focus on the
			announcement dates or geographic locations. Instead, I treated the 5-year period as a cohesive
			whole, aiming to uncover shifts in industries and startups during this unique turning point of
			history.
		</p>
		<p>
			To do this, I first looked into the funding stages. By consolidating the original 15 funding
			stage labels into six broader categories, I made the dataset more digestible and more relevant
			for comparative analysis.
		</p>
		<StageGrouping {normalWidth} />
		<p>
			And then I aggregated the layoff announcements by company and explored correlations across
			different sectors.
		</p>
		<CodeBlock codeSnippet={rollupSnippet} language="javascript" />
		<p>
			I use ObservableHQ to prototype the data transformation, and build interative charts for
			explorative analysis.
		</p>
	</section>
	<figure class="breakout" bind:clientWidth={breakoutWidth}>
		<iframe
			width="100%"
			height={breakoutWidth * 0.9}
			frameborder="0"
			title="Early analaysis created on Observable"
			src="https://observablehq.com/embed/@shanfan/tech-layoffs-analysis@1231?cells=viewof+industrySelection%2CfundingCorrelation"
		></iframe>
		<figcaption>
			This is one of the early charts, plotting the correlation between the funds raised and the
			layoff headcount, grouped by funding stages, and can be filtered by the industries.
		</figcaption>
	</figure>
	<section>
		<p>
			Much of my early exploration revolved around forming hypotheses and testing them quickly. For
			instance, I initially suspected that the amount of funds raised by a company might correlate
			with the scale of layoffs—but this idea didn’t hold up, so I excluded the <code
				>funds_raised</code
			> column in the final visualization. Instead, I found that the funding stage of a company offered
			more meaningful patterns.
		</p>
	</section>
	<figure class="breakout">
		<iframe
			width="100%"
			height={breakoutWidth * 1.1}
			frameborder="0"
			title="treemap showing the scale of layoffs compared across funding stages"
			src="https://observablehq.com/embed/3c4ef03f9e143003?cells=chart"
		></iframe>
		<figcaption>
			Another chart I had explored is to use a treemap to show the scale of layoffs compared across
			funding stages.
		</figcaption>
	</figure>
	<section>
		<h2>Heuristic Consideration for UX</h2>
		<p>
			Out of the dozens of exploratory charts I created during the ideation phase, I selected five
			to feature in the final essay. These were chosen not just for insight, but for how they guide
			a general audience through the topic with increasing complexity.
		</p>
		<p>
			The piece opens with a bold word cloud as the hero image—offering a visceral, immediate
			impression of the content to follow.
		</p>
		<p>
			The first two charts are straightforward bar charts with minimal interactivity, allowing
			readers to quickly grasp the core focus of the essay and build a foundational understanding of
			the dataset.
		</p>
		<p>
			Next comes a heatmap that maps industry sectors against funding stages. This adds
			dimensionality, helping readers spot patterns and priming them for the final visualization.
		</p>
		<p>
			The closing chart is a highly interactive beeswarm plot that puts the data in the reader’s
			hands. With tools to filter, slice, and clamp the data, readers can explore layoff
			distributions on their own terms. This final moment invites interpretation, encouraging each
			reader to draw their own conclusions.
		</p>
		<p>
			Although I personally prefer brighter, more playful color palettes, I chose a dark color
			scheme for this piece to suit the subject matter. The essay is meant to evoke a mood of grim
			reflection and invite the reader into a more somber contemplation.
		</p>
		<h2>Reflections</h2>
		<p>
			I was curious about how layoffs affected different industries, so I spent considerable time
			researching the companies tagged under each industry label. It quickly became clear that these
			categories functioned more like a loose taxonomy than strict definitions. To reflect this
			ambiguity, I annotated all 30 industries in the dataset with a relativity score—ranging from 0
			("not related at all") to 2 ("strongly related").
		</p>
	</section>
	<figure class="breakout">
		<img
			width="100%"
			height="auto"
			src={relationTable}
			alt="a spreadsheet table showing the relativity scores of 30 industries"
		/>
		<figcaption>Spreadsheet with relativity annotation</figcaption>
	</figure>

	<section>
		<p>I then reimagined these industry labels as a network graph. 👇</p>

		<figure bind:clientWidth={normalWidth}>
			<iframe
				width="100%"
				height={normalWidth * 1.1}
				frameborder="0"
				title="Prototype of the industry definition and relationships"
				src="https://observablehq.com/embed/1c6863953d58c68b@156?cells=network"
			></iframe>
			<figcaption>Industry taxonomy graph</figcaption>
		</figure>
		<p>
			In my initial implementation, this graph wasn’t just decorative—it doubled as a filter UI for
			the beeswarm chart. But user testing revealed it was too confusing to navigate. So I pivoted
			to a simpler, more familiar solution: checkboxes.
		</p>
		<p>In the end, the taxonomy graph found its place as the hero image of the article.</p>

		<h2>Acknowledgement</h2>
		<p>
			I could not have done this work without the generous support from Data Visualization Society.
			The idea was first developed at a <a
				href="https://infogr8.notion.site/Using-AI-to-visualize-its-own-impact-1d0a6bed87a5803c8ac3de9e0d31df09"
				target="_blank">Future Fridays workshop</a
			>, led by
			<a href="https://www.linkedin.com/in/rudi-orm/" target="_blank"> Rudi O'Reilly Meehan</a> and
			<a href="https://www.instagram.com/ta_daaata/" target="_blank"> Martina Zunica</a>. The final
			product was completed under the
			<a href="https://www.datavisualizationsociety.org/mentorship" target="_blank">
				DVS Mentorshop Program</a
			>, advised by
			<a href="https://anastasiastevens.com/" target="_blank"> Anastasia Stevens</a> and
			<a href="https://www.linkedin.com/in/brian-grucan-rouse/" target="_blank"> Brian Rouse</a>
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
