import { ReactElement, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';

import { MdClose } from 'react-icons/md';

import styles from '../style/dropdown.module.css';


export interface Option {
  label: string,
  value: string
}

export interface Tag extends Option {
  color?: string
}

export interface DropdownProps {
  options: Option [],
  editable?: boolean,
  tagMode?: boolean,
  defaultTags?: Tag [],
  onSelect?: ((option: Option) => void),
  listSize?: number,
  renderItem?: ((option: Option, idx: number) => ReactElement)
}


function Dropdown ({ options, editable, tagMode, defaultTags, onSelect, listSize, renderItem }: DropdownProps): ReactElement {

  const [displayedOptions, setDisplayedOptions] = useState<Option []>(options);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [selectValue, setSelectValue] = useState<string>('');
  const [tags, setTags] = useState<Tag []>(defaultTags as Tag [] || []);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const item =  displayedOptions.length 
      ? displayedOptions[selectedItem] 
      : { value: selectValue, label: selectValue };

    setSelectValue(item.label);
  }, [selectedItem]);


  useEffect(() => {
    if (isOpen === false) {
      setDisplayedOptions(options);
    }
  }, [isOpen])


  function handleSelectKeyPress (event: any) {
    const { keyCode } = event;
    const max = displayedOptions.length - 1;
    let item = selectedItem;
    const noOptions = !displayedOptions.length;

    // @ts-ignore
    if (keyCode === 8 && selectValue.length === 0) {
      setTags(tags.filter((_: Tag, idx) => idx !== tags.length - 1));
    }
    if (keyCode === 13 && selectValue.length) {
      const tagValue = displayedOptions.length ? displayedOptions[item] : { value: selectValue, label: selectValue };

      setIsOpen(false);
      
      if (tagMode) {
        setTags([...tags, tagValue]);
        setSelectValue('');
        return;
      }
      setSelectValue(tagValue.label);
      onSelect?.(tagValue);
    }

    setIsOpen(true);

    if (keyCode === 40) {
      item = (item < max) ? (item + 1) : 0;
    } else if (keyCode === 38) {
      item = (item > 0) ? (item - 1) : max;
    } else {
      return;
    }

    setSelectedItem(item);
  }

  function handleSelectOnChange (event: any) {
    const { value } = event.target;
    const length = value.length;
    
    // @ts-ignore
    if (editable) {
      setSelectValue(value);

      if (length > 0 && options.length) {
        setDisplayedOptions(options.filter(o => o.label.slice(0, length)  === value.slice(0, length)));
      } else {
        setDisplayedOptions(options);
      }
    }
  }

  function handleItemClick (event: Event, idx: number) {
    // @ts-ignore
    if (!displayedOptions.length) {
      return
    }
    setSelectedItem(idx);
    setIsOpen(false);
    onSelect?.(displayedOptions[idx]);
    
    if (tagMode) {
      setTags([...tags, displayedOptions[idx]]);
      // @ts-ignore
    }
  }

  function handleTagClose (idx: number) {
    setTags(tags.filter((_: Tag, i: number) => i !== idx));
  }

  return (
    <div className={ styles.dropdownContainer }>
      <div className={ styles.selectContainer }>
        <>
          {tagMode && tags.length > 0 && (
            <div className={ styles.tagsContainer } >
              {tags.map((tag: Tag, idx: number) => (
                <div 
                  key={idx}
                  className={ styles.tag }
                  onClick={() => handleTagClose(idx)}
                >
                  <span>{ tag.label }</span>
                  <MdClose />
                </div>
              ))}
            </div>
          )}
        </>
        <input
          type="text" 
          ref={inputRef}
          className={ styles.select + ' ' + ((editable) ? '' : styles.selectDisabled) } 
          onChange={handleSelectOnChange} 
          onKeyDown={handleSelectKeyPress} 
          onClick={() => setIsOpen(true)}
          value={selectValue} 
        />
      </div>
      <div className={ styles.itemsContainer + ' ' + ((isOpen) ? '' : styles.itemsContainerClosed) }>
          {displayedOptions ? (
            <>
              {displayedOptions.map((value: any, idx: number) => (
                <a 
                  key={idx}
                  href="#"
                  onClick={(e: any) => handleItemClick(e, idx)}
                  onMouseEnter={() => setSelectedItem(idx)}
                  className={ styles.itemContainer + ' ' + ((idx === selectedItem) ? styles.itemContainerSelected : '') }
                >
                  {renderItem?.(value, idx)}
                </a>
              ))}
            </>
          ) : (
            <span className={styles.loadingContent} />
          )}
      </div>
    </div>
  )
}

Dropdown.defaultProps = {
  editable: false,
  tagMode: false,
  defaultTags: [] as Option [],
  listSize: 6,
  renderItem: (option: Option, idx: number) => <span className={styles.itemText}>{option.label}</span>
};

export default Dropdown;
