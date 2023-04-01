import * as neo4j from 'neo4j-driver';
import { NodeLabels, EdgeTypes, Label, Parameter, ParameterObject, InputFilter, Filter } from './types';


export class BasicQuery {

	private driver: neo4j.Driver;
	private labels: [Label?, Label?];
	private relType: Label | undefined;
	private filters: [string?, string?, string?];
	private parameters: ParameterObject;
	private isNodeQuery: boolean;

	constructor (driver: neo4j.Driver) {
		this.driver = driver;
		this.labels = [];
		this.relType = undefined;
		this.filters = [];
		this.parameters = {};
		this.isNodeQuery = false;
	}

	public getNodes (label: NodeLabels | undefined): BasicQuery {
		this.isNodeQuery = true;

		if (label) {
			this.labels.push(`:${label}`);
		}

		return this;
	}

	public getEdges (type: EdgeTypes | undefined, nodeLabels: [NodeLabels?, NodeLabels?]): BasicQuery {
		if (nodeLabels) {
			this.labels = nodeLabels.map(label => `:${label}` as Label) as [Label?, Label?];
		}
		if (type) {
			this.relType = `:${type}` as Label;
		}
		
		return this;
	}

	public where (where: [InputFilter?, InputFilter?, InputFilter?]): BasicQuery {
		let parameterId: number = 0;

		for (const filters of where) {
			let newFilter: string [] = [];

			if (!filters) {
				this.filters.push('');
				continue;
			}

			Object.entries(filters as InputFilter []).forEach((elem, idx) => {
				const [key, value] = elem;
				const parameter: Parameter = `${key}_${parameterId}`;
				let filter: Filter = `${key}: $${parameter}`;

				this.parameters = {
					[parameter]: value,
					...this.parameters
				};
				newFilter.push(filter);
				parameterId++;
			});

			this.filters.push(` {${newFilter.join(',')}}`);
		}
		return this;	
	}

	public async execute (): Promise<any> {
		const {labels, relType, filters, parameters} = this;
		let query: string = '';

		if (this.isNodeQuery) {
			query = `MATCH (r${labels[0]}${filters[0]}) RETURN r`;
		} else {
			query = `MATCH (a${labels[0]}${filters[0]})-[r${relType}${filters[1]}]-(b${labels[1]}${filters[2]}) RETURN r`;
		}

		const { records } = await this.driver.executeQuery(query, parameters);

		return records.map(record => record.get('r'));
	}
}
