import { ReactElement } from "react";
import styles from '../style/timeline.module.css';


type Layout = 'left' | 'right';

interface TimeLineProps<T extends any> {
	elements: T [],
	labels: string [],
	renderElement: (element: T) => ReactElement,
	elementsLayout?: Layout
}

function Timeline<T>({
	elements = [], 
	labels = [], 
	renderElement, 
	elementsLayout = 'right'
}: TimeLineProps<T>): ReactElement {
	interface Row {
		label?: string,
		element?: T
	}

	const rowNumber = elements.length > labels.length ? elements.length : labels.length
	const rows: Row [] = Array.from({ length: rowNumber }, (_, idx) => ({
		label: idx < labels.length ? labels[idx] : undefined,
		element: idx < elements.length ? elements[idx] : undefined
	}))

	const CSSRowFlexDirectionStyle: React.CSSProperties = {
		flexDirection: elementsLayout === 'right' ? 'row' : 'row-reverse'
	};

	return (
		<div id={ styles.timeline }>
			{rows.map((row, idx) => (
				<div id={ styles.timelineRow } style={CSSRowFlexDirectionStyle} key={idx}>
					<div id={ styles.timelineLabelContainer }>
						{row.label && (
							<span id={ styles.timelineLabel }>{ row.label }</span>
						)}
					</div>
					<div id={ styles.timelineNodeContainer }>
						<div className={ `${styles.timelineLine} ${idx === 0 ? styles.timelineLineTop : ''}` } />
						<div id={ styles.timelineNode } />
						<div className={ `${styles.timelineLine} ${idx === rows.length - 1 ? styles.timelineLineBottom : ''}`} />
					</div>
					<div id={ styles.timelineElementContainer }>
						{row.element && renderElement(row.element)}
					</div>
				</div>
			))}
		</div>
	);
}

export default Timeline;
