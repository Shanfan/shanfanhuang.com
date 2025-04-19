<script>
	//@ts-nocheck
	import { getContext } from 'svelte';
	import './style.css';
	import ComparisonBar from './ComparisonBar.svelte';
	const data = getContext('industryData');
	const measure = 'industry';
	let selected = $state();
	$inspect(selected);
</script>

<div class="main-content">
	<ComparisonBar
		{measure}
		{data}
		selectedKey={(key) => {
			selected = key;
		}}
	/>
	<p>Note that the definition of an industry can be ambiguous.</p>
	<p class="footnote">
		&ldquo;Other&rdquo; included companies such as Microsoft, Miro, Oracle, and Asana.
	</p>
	<p class="footnote">
		&ldquo;Infrastructure&rdquo; refers to information networking companies such as Cisco, VMware,
		New Relic, Docker, and BitTorrent.
	</p>
	<p class="footnote">
		Google and Meta are classified under &ldquo;Consumer&rdquo;, whereas Apple is in
		&ldquo;Hardware&rdquo; and Amazon &ldquo;Retail&rdquo;, although they all have businesses in
		different industries.
	</p>
</div>
<aside>
	<p class="insight">
		Relatively few hardware companies made layoff announcements, yet the jobs eliminated in this
		field is quite high.
	</p>
	<p class="insight">
		Consumer, Retail, Transportation, and Finance are among the top industries that slashed jobs in
		past five years.
	</p>
	<div>
		{#if selected}
			<p>Industry: {selected.key}</p>
			<p>Companies: {selected.companies}</p>
			<p>Job loss: {selected.ppl_laidoff}</p>
			<p>
				Click on a different <span style="text-transform: uppercase; font-size: 0.85em"
					>{measure}</span
				>
				to see details.
			</p>
		{:else}
			<p>
				Click on <span style="text-transform: uppercase; font-size: 0.85em">{measure}</span> in the chart
				to see details.
			</p>
		{/if}
	</div>
</aside>
