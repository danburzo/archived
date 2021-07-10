import React, { useState, useEffect, useRef } from 'react';

import './Slider.css';

const Slider = ({ min, max, value, onChange }) => {

	// State
	let [ interacting, setInteracting ] = useState(false);
	let element = useRef(null);

	const start = e => setInteracting(true);
	const end = e => setInteracting(false);
	
	const start_and_change = e => {
		start();
		change(e);
	};

	const change = e => {
		if (!element.current) return;
		let rect = element.current.getBoundingClientRect();
		let val = Math.max(
			min, 
			Math.min(
				max, 
				Math.round(min + (e.clientX - rect.x) / rect.width * (max - min))
			)
		);
		onChange(val);
	};

	// Reactive effects
	useEffect(() => {
		if (!interacting) return;
		document.addEventListener('mousemove', change);
		document.addEventListener('mouseup', end);
		return () => {
			document.removeEventListener('mousemove', change);
			document.removeEventListener('mouseup', end);
		};
	}, [interacting]);

	let percent = (value - min)/(max - min) * 100;

	return (
		<div className='uix-slider' onMouseDown={start_and_change} ref={element}>
			<div 
				className='uix-slider__handle'
				onMouseDown={start}
				style={{
					left: `${percent}%`
				}}
			/>
		</div>
	);
};

Slider.defaultProps = {
	min: 0,
	max: 100,
	value: 50
};

export default Slider;