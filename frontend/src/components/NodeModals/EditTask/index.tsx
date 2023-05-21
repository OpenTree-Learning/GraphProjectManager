import { ReactElement, useState, useEffect } from "react";
import Select from 'react-select';

import IndicatorSeparator from "./label";

import { TNode, TPriorityOrder, TState } from "../../../types/Project";

import styles from './style.module.css';


const stateColors = {
  [TState.TODO]: '#e74c3c',
  [TState.DOING]: '#f1c40f',
  [TState.DONE]: '#07bc0c'
};

const normalStyles: any = {
  control: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => ({ ...styles, width: '120px', backgroundColor: '#203131', fontSize: '14px', color: 'white'}),
  option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
    return {
      ...styles,
      backgroundColor: '#203131',
      fontSize: '14px',
      cursor: isDisabled ? 'not-allowed' : 'default'
    };
  },
  input: (styles: any) => ({ ...styles }),
  placeholder: (styles: any) => ({ ...styles }),
  singleValue: (styles: any, { data }: any) => ({...styles, color: 'white'}),
  menuList: (styles: any) => ({...styles, padding: 0})
}

const colourStyles: any = {
  control: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
    // @ts-ignore
    return { 
      ...styles, 
      width: '110px',
      backgroundColor: '#203131',
      fontSize: '14px'
    }
  },
  option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
    // @ts-ignore
    const color = stateColors[data.value];
    return {
      ...styles,
      backgroundColor: '#203131',
      color: color,
      fontSize: '14px',
      cursor: isDisabled ? 'not-allowed' : 'default'
    };
  },
  input: (styles: any) => ({ ...styles }),
  placeholder: (styles: any) => ({ ...styles }),
  singleValue: (styles: any, { data }: any) => {
    // @ts-ignore
    const color = stateColors[data.value];

    return {
      ...styles, 
      color: color
    };
  },
  menuList: (styles: any) => ({...styles, padding: 0})
};


interface EditTaskProps {
  task?: TNode
};

function EditTask (props: EditTaskProps): ReactElement {
  const stateSerialize = (s: TState): string => Object.values(TState)[s] as string;
  const stateDeserialize = (s: string | undefined): TState => !s ? TState.TODO : Object.values(TState).findIndex((v: any) => v === s) as TState;

  const { task } = props;
  const [name, setName] = useState<string>(task?.name || '');
  const [description, setDescription] = useState<string>(task?.description || '');
  const [state, setState] = useState<TState>(stateDeserialize(task?.state));
  const [priorityOrder, setPriorityOrder] = useState<TPriorityOrder>(task?.priorityOrder || TPriorityOrder.NORMAL);
  const [labels, setLabels] = useState<string []>(task?.labels || []);

  const [nameValid, setNameValid] = useState<boolean | null>(null);


  const stateOptions = [
    { value: TState.TODO, label: 'To Do' },
    { value: TState.DOING, label: 'Doing' },
    { value: TState.DONE, label: 'Done' },
  ];

  const priorityOptions = [
    { value: TPriorityOrder.URGENT, label: 'Urgent' },
    { value: TPriorityOrder.HIGH, label: 'High' },
    { value: TPriorityOrder.NORMAL, label: 'Normal' },
    { value: TPriorityOrder.LOW, label: 'Low' },
  ];

  //LOW,
  //NORMAL,
  //HIGH,
  //URGENT

  const isEditMode = () => !!props.task;

  useEffect(() => {
    if (name.length < 3) {
      setNameValid(false);
    }
  }, [name]);

  console.log(state);
  console.log(typeof state);


  return (
			<div id={ styles.editTaskForm }>
        <h3 id={ styles.title } >{isEditMode() ? 'Edit task' : 'Create a new task'}</h3>
        <div id={ styles.name }>
          <h5 className={ styles.label }>Title</h5>
          <input 
            type='text' name='name' 
            onChange={e => setName(e.target.value)} value={name} placeholder='Name'
            className={ nameValid ? '' : 'invalidInput' }
          />
          {nameValid === false && (<span>Task name must have at least 3 characters.</span>)}
        </div>
        <div id={ styles.description }>
          <h5 className={ styles.label }>Description</h5>
          <textarea 
            name='description' 
            onChange={e => setDescription(e.target.value)} value={description} placeholder='Description'
            rows={5}
          />
        </div>
        <div id={ styles.otherProperties }>
          <div id={ styles.state } >
            <h5 className={ styles.label }>State</h5>
            <Select
              id={ styles.state }
              defaultValue={stateOptions.find((v: any) => v.value === state)}
              options={stateOptions}
              styles={colourStyles}
            />
          </div>
          <div id={ styles.priority } >
            <h5 className={ styles.label }>Priority</h5>
            <Select
              id={ styles.state }
              defaultValue={priorityOptions.find((v: any) => v.value === priorityOrder)}
              options={priorityOptions}
              styles={normalStyles}
            />
          </div>
        </div>
        <div id={ styles.labels }>
          <Select
            closeMenuOnSelect={false}
            components={{ IndicatorSeparator }}
            isMulti
            styles={normalStyles}
            options={labels.map((label: string) => ({value: label, label: label}))}
          />
        </div>
			</div>
  );
}

export default EditTask;
