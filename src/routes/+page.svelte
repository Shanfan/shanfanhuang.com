<script>
	// @ts-nocheck
	import profileImg from '$lib/images/shanfan_headshot_sq.jpg';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Shanfan Huang personal site" />
</svelte:head>

<section>
	<img class="profile" src={profileImg} alt="shanfan huang profile" />
	<div class="card">
		<h1>Shanfan Huang</h1>
		<h2 style="font-style: italic; font-weight: 100;">
			Visual Storytelling, Information Design, UI/UX, Data Visualization, Front-end Development
		</h2>
		<p style="font-size: 1.5em">
			Find my work at <a href="/pictxtnum">Picture, Text, and Numbers</a> and this place.
		</p>
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
		border: 1px solid #fff;
	}
</style>
