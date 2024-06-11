import React from 'react';
import styles from '../css/Background.module.css'

export default class App extends React.Component {
	render(){
		return (
			<div>
				<div className={styles.train} ></div>
				<div className={styles.bokeh2} ></div>
				<div></div>
			</div>
		)
	}
}