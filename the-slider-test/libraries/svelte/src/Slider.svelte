<script>
	import { onDestroy } from 'svelte'; 

	// Props
	export let min = 0;
	export let max = 100;
	export let value = 50;

	// State
	let interacting = false;

	// Refs
	let element;

	// Event Listeners
	
	const start = () => interacting = true;
	const end = () => interacting = false;

	const start_and_change = e => {
		start();
		change(e);
	};

	const change = e => {
		if (!element) return;
		let rect = element.getBoundingClientRect();
		value = Math.max(
			min, 
			Math.min(
				max, 
				Math.round(min + (e.clientX - rect.x) / rect.width * (max - min))
			)
		);
	};

	// Reactive statements

	$: if (interacting) {
		document.addEventListener('mousemove', change);
		document.addEventListener('mouseup', end);
	} else {
		document.removeEventListener('mousemove', change);
		document.removeEventListener('mouseup', end);
	};

	$: percent = (value - min)/(max - min) * 100;

	// Lifecycle
	onDestroy(() => {
		document.removeEventListener('mousemove', change);
		document.removeEventListener('mouseup', end);
	});

</script>

<style>
	:global(.uix-slider) {
		height: 1em;
		border: 1px solid #000;
		position: relative;
	}

	:global(.uix-slider__handle) {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		height: 1em;
		width: 1em;
		border-radius: 50%;
		background: #ccc;
	}
</style>

<div class='uix-slider' bind:this={element} on:mousedown={start_and_change}>
	<div class='uix-slider__handle' style='left:{percent}%' on:mousedown={start}/>
</div>