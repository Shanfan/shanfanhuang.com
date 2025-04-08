<script>
	import { format } from 'd3';
	let { company } = $props();
</script>

<div class="billboard">
	<h3>Layoff Events by Company</h3>
	<p>
		{company.company} | {company.industry} | Total: {format(',')(company.layoff)} ppl laid off
	</p>
	<table>
		<thead>
			<tr>
				<th>Date</th>
				<th>Location</th>
				<th>%</th>
				<th>Layoff</th>
			</tr>
		</thead>
		<tbody>
			{#each company.events as e}
				<tr>
					<td>{e.date}</td>
					<td>{e.location} <br /> {e.country}</td>
					<td>{e.percentage ? e.percentage : 'N/A'}</td>
					<td>{format(',')(e.layoff)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.billboard {
		position: fixed;
		right: 0;
		top: 30vh;
		padding: 1em;
		width: 25em;
		border-radius: 5px 0 0 5px;
		background-color: white;
		text-align: center;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}
	.billboard h3 {
		margin-top: 0;
	}
	.billboard p {
		font-size: 1em;
	}
	.billboard table {
		width: 100%;
		text-align: left;
		font-size: 0.85em;
	}
	.billboard table td {
		padding: 0.25em 0.5em;
	}
	.billboard table td:last-child,
	.billboard table th:last-child {
		text-align: right;
	}

	.billboard table tbody tr:nth-child(odd) {
		background-color: #f2f2f2;
	}
</style>
