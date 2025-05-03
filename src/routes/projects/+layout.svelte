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
	let bgColor = $derived($page.data?.pageBg ?? 'var(--color-light-bg)');
	let currentRoute = $derived($page.route.id);

	$inspect(bgColor, theme, currentRoute);
</script>

<div class="app {theme}" style="background: {bgColor}">
	<main>
		{@render children()}
	</main>

	<footer class={theme}>
		<h1>Shanfan Huang's Personal Website</h1>
		<nav>
			<a href="/projects">Projects</a>
			<a href="/notes">Design Notes</a>
			<a href="/">About</a>
		</nav>
		<p>
			Shanfan 💖 D3.js, CSS, and homebrewed kombucha. <br />
			This site is built with SvelteKit on Vercel. All rights reserved.
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

	footer h1 {
		font-size: 2rem;
	}

	nav {
		display: flex;
		padding: 0.5em;
	}

	nav a {
		font-size: 1.2rem;
		display: inline-block;
		text-decoration: none;
		padding: 0.5em 1em;
		text-transform: uppercase;
	}

	nav a:hover,
	nav a:focus {
		color: var(--color-dark-bg);
		background: var(--color-accent-on-dark);
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1em 0;
		text-align: center;
		background-position: bottom center;
		background-repeat: no-repeat;
		background-size: cover;
		font-size: 0.8em;
		background-image: url('$lib/images/footer_banner.svg');
	}

	@media (max-width: 480px) {
		footer {
			padding: 0.5em 0.25em;
		}
	}
</style>
