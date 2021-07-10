<script>
	// Props
	export let min = 0;
	export let max = 100;
	export let value = 50;
</script>

<style>
	
</style>

<input type='number' bind:value={value} min={min} max={max} />