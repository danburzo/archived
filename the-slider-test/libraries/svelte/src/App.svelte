<script>
	// Components
	import Slider from './Slider.svelte';
	import Input from './Input.svelte';

	// Props
	export let min = 0;
	export let max = 100;
	export let value = 50;

</script>

<style>
	:global(.demo) {
		display: flex;
		width: 100%;
	}

	:global(.demo .uix-slider) {
		flex-grow: 1;
	}
</style>

<div class='demo'>
	<Slider bind:min={min} bind:max={max} bind:value={value}/>
	<Input bind:min={min} bind:max={max} bind:value={value} />
</div>
