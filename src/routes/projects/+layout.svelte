<script>
	// @ts-nocheck
	import '../../app.css';

	let { children } = $props();
	// $inspect('my page data is: ', page.data);
</script>

<div class="app">
	<header>
		<a href="/projects">Projects</a>
		<a href="/">About</a>
		<a href="/">Design Notes</a>
	</header>
	<main>
		{@render children()}
	</main>

	<footer>
		<p>
			Shanfan 💖 D3.js, CSS, and homebrewed kombucha. <br />
			<a href="https://www.shanfanhuang.com">shanfanhuang.com</a> is built with SvelteKit on Vercel.
			All rights reserved.
		</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: #222; /* change this to be a variable */
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1em 0;
		text-align: center;
		background-position: top left;
		background-repeat: no-repeat;
		background-size: cover;
		font-size: 0.8em;
		/* bg image should be edited to be more subtle */
		background-image: url('$lib/images/footer_banner.svg');
		/* color should change based on .app bg color */
		color: #eee;
	}

	@media (max-width: 480px) {
		footer {
			padding: 0.5em 0.25em;
		}
	}
</style>
