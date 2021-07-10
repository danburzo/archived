import React from 'react';

export default ({ min, max, value, onChange }) => {
	const change = e => onChange(e.target.value);
	return (
		<input type='number' onChange={change} min={min} max={max} value={value}/>
	);
};