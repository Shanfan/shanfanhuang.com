<script>
	//@ts-nocheck
	import { getContext } from 'svelte';
	import './style.css';
	import ComparisonBar from './ComparisonBar.svelte';
	import ComparisonBarBulletin from './ComparisonBarBulletin.svelte';
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
	<ComparisonBarBulletin {measure} {selected} />
</aside>
