<script>
	import bgVid from '$lib/videos/bg.mp4';
</script>

<video autoplay muted loop playsinline>
	<source src={bgVid} type="video/mp4" />
	Your browser does not support the video tag.
</video>

<style>
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
		z-index: 0;
	}
</style>
