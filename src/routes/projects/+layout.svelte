<script>
	// @ts-nocheck
	import '../../app.css';
	import { page } from '$app/stores';

	let { children } = $props();

	const navigation = [
		{ name: 'projects', route: '/projects' },
		{ name: 'about', route: '/' },
		{ name: 'design notes', route: '/notes' }
	];

	let theme = $derived($page.data?.theme ?? 'light');
	let bgColor = $derived($page.data?.pageBg ?? '#eee');
	let currentRoute = $derived($page.route.id);

	$inspect(bgColor, theme, currentRoute);
</script>

<div class="app {theme}" style="background: {bgColor}">
	<header>
		<nav>
			<a href="/projects">Projects</a>
			<!-- <a href="/notes">Design Notes</a> -->
			<a href="/">About</a>
		</nav>
	</header>
	<main>
		{@render children()}
	</main>

	<footer class={theme}>
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
	}

	main {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	header {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		width: 100vw;
	}

	nav {
		display: flex;
		padding: 0.5em;
	}

	nav a {
		display: inline-block;
		text-decoration: none;
		padding: 0.5em 1em;
		text-transform: uppercase;
	}

	nav a:hover,
	nav a:focus {
		color: #fff;
		background: var(--color-link);
	}

	nav a:last-child {
		margin-left: auto;
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
		background-image: url('$lib/images/footer_banner.svg');
	}

	.dark {
		color: #ccc;
	}

	.light {
		color: #666;
	}

	@media (max-width: 480px) {
		footer {
			padding: 0.5em 0.25em;
		}
	}
</style>
