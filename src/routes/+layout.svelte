<script>
	// @ts-nocheck
	import '../app.css';
	import logo from '$lib/images/gem_logo.png';
	import { page } from '$app/stores';
	let { children } = $props();

	let theme = $derived($page.data?.theme ?? 'light');
	let bgColor = $derived($page.data?.pageBg ?? 'var(--color-light-bg)');
	let currentRoute = $derived($page.route.id);
</script>

<div class="app {theme}">
	<header class={theme}>
		<nav>
			{#if currentRoute === '/'}
				<img
					src={logo}
					alt="logo"
					width="64"
					height="auto"
					title="Shanfan Huang's Personal Website"
				/>
				<p>Projects</p>
				<a href="/about">About</a>
			{:else if currentRoute === '/about'}
				<img
					src={logo}
					alt="logo"
					width="64"
					height="auto"
					title="Shanfan Huang's Personal Website"
				/>
				<a href="/">Projects</a>
				<p>About</p>
			{:else}
				<img
					src={logo}
					alt="logo"
					width="64"
					height="auto"
					title="Shanfan Huang's Personal Website"
				/>
				<a href="/">Projects</a>
				<a href="/about">About</a>
			{/if}
		</nav>
	</header>
	<main>
		{@render children()}
	</main>

	<footer class={theme}>
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

	nav {
		display: flex;
		padding: 0.5em;
		align-items: center;
	}

	nav > * {
		display: inline-block;
		text-decoration: none;
		padding: 0.5em 1em;
		text-transform: uppercase;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1em 0;
		text-align: center;
		background-position: top center;
		background-repeat: no-repeat;
		background-size: cover;
		font-size: 0.8em;
		background-image: url('$lib/images/footer_banner.svg');
		z-index: 1;
	}

	@media (max-width: 480px) {
		footer {
			padding: 0.5em 0.25em;
		}
	}
</style>
