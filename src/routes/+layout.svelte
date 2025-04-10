<script>
	// @ts-nocheck
	import '../app.css';

	let { children } = $props();
</script>

<div class="app">
	<main>
		{@render children()}
	</main>

	<footer>
		<p style="font-size: 0.8em;">
			Shanfan 💖 D3.js, CSS, and homebrewed kombucha. <br />
			<a href="www.shanfanhuang.com">shanfanhuang.com</a> is built with SvelteKit on Vercel. All rights
			reserved.
		</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px 0;
		text-align: center;
		background-image: url('$lib/images/footer_banner.svg');
		background-position: top left;
		background-repeat: no-repeat;
		background-size: cover;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
