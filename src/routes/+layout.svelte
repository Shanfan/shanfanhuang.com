<script lang="ts">
	import '../app.css';
	import bgVid from '$lib/videos/bg.mp4';

	let { children } = $props();
</script>

<div class="app">
	<video autoplay muted loop playsinline>
		<source src={bgVid} type="video/mp4" />
		Your browser does not support the video tag.
	</video>
	<main>
		{@render children()}
	</main>

	<footer>
		<p>All rights reserved.</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	video {
		position: fixed;
		top: 50%;
		left: 50%;
		min-width: 100vw;
		min-height: 100vh;
		width: auto;
		height: auto;
		transform: translate(-50%, -50%);
		object-fit: cover;
		z-index: -1;
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
		color: #eee;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
