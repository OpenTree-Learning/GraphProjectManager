import { ReactElement, useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import { TNode, TPriorityOrder, TState } from "../../../types/Project";

import styles from './style.module.css';
import Dropdown, { Option } from "../../Dropdown";
import { NodeModalProps } from '..';

import { UPDATE_TASKS } from "../../../graphql/Project/updateTask";
import {notify} from "../../../utils/notify";
import { PROJECT_GRAPH } from "../../../graphql/Project/projectGraph";


const mainButtonTitle = 'Save';
const secondButtonTitle = 'Cancel';


function EditTask (props: NodeModalProps): ReactElement {
  const stateSerialize = (s: TState): string => Object.values(TState)[s] as string;
  const prioritySerialize = (s: TPriorityOrder): string => Object.values(TPriorityOrder)[s] as string;
  //const stateDeserialize = (s: string | undefined): TState => !s ? TState.TODO : Object.values(TState).findIndex((v: any) => v === s) as TState;

  const task = props.node as TNode;
  const [name, setName] = useState<string>(task?.name || '');
  const [description, setDescription] = useState<string>(task?.description || '');
  const [taskState, setTaskState] = useState<string>(task?.state || stateSerialize(TState.TODO));
  const [priorityOrder, setPriorityOrder] = useState<string>(task?.priorityOrder || prioritySerialize(TPriorityOrder.NORMAL));
  const [labels, setLabels] = useState<string []>(task?.labels || []);

  const [nameValid, setNameValid] = useState<boolean | null>(null);

  const [updateTasks, { data, loading, error }] = useMutation(UPDATE_TASKS, {
    refetchQueries: [{
      query: PROJECT_GRAPH
    }]
  });

  console.log('initial task state:', taskState);
  console.log('initial priority order:', priorityOrder);

  const stateOptions = [
    { value: stateSerialize(TState.TODO), label: 'To Do' },
    { value: stateSerialize(TState.DOING), label: 'Doing' },
    { value: stateSerialize(TState.DONE), label: 'Done' },
  ];

  const stateColors = {
    [stateSerialize(TState.TODO)]: '#e74c3c',
    [stateSerialize(TState.DOING)]: '#f1c40f',
    [stateSerialize(TState.DONE)]: '#07bc0c',
  };

  const priorityOptions = [
    { value: prioritySerialize(TPriorityOrder.URGENT), label: 'Urgent' },
    { value: prioritySerialize(TPriorityOrder.HIGH), label: 'High' },
    { value: prioritySerialize(TPriorityOrder.NORMAL), label: 'Normal' },
    { value: prioritySerialize(TPriorityOrder.LOW), label: 'Low' },
  ];

  const priorityColors = {
    [prioritySerialize(TPriorityOrder.URGENT)]: '#e74c3c',
    [prioritySerialize(TPriorityOrder.HIGH)]: '#FFF700',
    [prioritySerialize(TPriorityOrder.NORMAL)]: '#F4BD33',
    [prioritySerialize(TPriorityOrder.LOW)]: '#E98265',
  };

  const isEditMode = () => !!props.node;

  useEffect(() => {
    function handleSaveClick (e: Event) {
      console.log('saving task state as ', taskState);
      console.log('saving priority as:', priorityOrder);

      e.preventDefault();
      updateTasks({
        variables: {
          where: {
            id: props.node.id
          },
          update: {
            name: name,
            description: description,
            state: taskState,
            priorityOrder: priorityOrder,
            labels: labels
          }
        }
      })
      .then(res => {
        notify('Task successfully updated!', 'success');
        props.closeModal();
      })
      .catch(err => {
        notify(err.message, 'error');
      });

    }
    props.onMainButtonSet('Save', '#2ea043', handleSaveClick);
  }, [name, description, taskState, priorityOrder, labels]);

  function handleCloseClick (e: Event) {
    e.preventDefault();
    props.closeModal();
  }

  useEffect(() => {
    const title = isEditMode() ? 'Edit task' : 'Create task';
    
    console.log('use effect again!')
    props.onTitleSet(title);
    props.onSecondButtonSet('Cancel', '#161b22', handleCloseClick);
  }, []);

  useEffect(() => {
    if (name.length < 3) {
      setNameValid(false);
    }
  }, [name]);

  useEffect(() => {
    console.log('task state changed to:', taskState);
  }, [taskState]);

  useEffect(() => {
    console.log('priority order changed to:', priorityOrder);
  }, [priorityOrder]);

  return (
			<div id={ styles.editTaskForm }>
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
            <Dropdown 
              options={stateOptions}
              editable
              onSelect={(option: Option) => setTaskState(option.value)}
              renderItem={(option) => (
                <div className={ styles.tagOption }>
                  <div className={ styles.tagColor } style={{ backgroundColor: stateColors[option.value] }}/>
                  <span className={ styles.tagLabel }>
                    { option.label } 
                  </span>
                </div>
              )}
            />
          </div>
          <div id={ styles.priority } >
            <h5 className={ styles.label }>Priority</h5>
            <Dropdown 
              options={priorityOptions}
              editable
              onSelect={(option: Option) => setPriorityOrder(option.value)}
              renderItem={(option) => (
                <div className={ styles.tagOption }>
                  <div className={ styles.tagColor } style={{ backgroundColor: priorityColors[option.value] }}/>
                  <span className={ styles.tagLabel }>
                    { option.label } 
                  </span>
                </div>
              )}
            />
          </div>
        </div>
        <div id={ styles.tags }>
          <div>
            <h5 className={ styles.label }>Labels</h5>
            <Dropdown 
              options={[]}
              editable
              tagMode
              defaultTags={labels.map((value: string) => (
               { value: value, label: value, color: '' }
              ))}
              onSelect={(option: Option) => setLabels([...labels, option.value])}
              />
          </div>
        </div>
			</div>
  );
}

export default EditTask;
