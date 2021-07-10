import React, { useState } from 'react';

import Input from './Input';
import Slider from './Slider';

import './App.css';

export default () => {
	let [current_value, setValue] = useState(50);
	let min = 0;
	let max = 100;

	return (
		<div className='demo'>
			<Slider value={current_value} min={min} max={max} onChange={setValue} />	
			<Input value={current_value} min={min} max={max} onChange={setValue} />
		</div>
	);
};