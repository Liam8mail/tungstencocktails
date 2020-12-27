import {useState, useEffect, useCallback} from 'react';
import {backButtonUrl} from '../util/imgPicker';

export default function DropDown(props){

        const [ isListOpen, setIsListOpen] = useState();
        const [ headerTitle, setHeaderTitle] = useState();
        const { list, toggleItem, title, single, multi } = props;

        const toggleList = () => {
            setIsListOpen(prevIsListOpen => !prevIsListOpen)
        }

        // const selectItem = (item) => {
        //     const { title, id, key } = item;
        //     setHeaderTitle(title);
        //     setIsListOpen(false);
        //     toggleItem(id, key);
        // }
        
        const handleClose = useCallback(() => {
            setIsListOpen(false)
        },[setIsListOpen])


        useEffect(() => {

            setTimeout(() => {
            if(isListOpen){
                window.addEventListener('click', handleClose)
              }
              else{
                window.removeEventListener('click', handleClose)
              }
            },0);

            return () => {
                window.removeEventListener('click', handleClose);
            }

        },[isListOpen, handleClose]);


        useEffect(() => {

            const count = list.filter((item) => item.selected).length;

            if (count === 0) {
                setHeaderTitle(title);
              }
              if (count === 1) {
                setHeaderTitle(`${count} ${single}`);
              }
              if (count > 1) {
                setHeaderTitle(`${count} ${multi}`);
              }
            
        },[list,multi, single,title])
        

        const handleSelect = (id) => {
            toggleItem(id);
        }


        return (
          <div className="dropdown-wrapper">
            <button 
              type="button"
              className="dropdown-header"
              onClick={toggleList}
            >
              <h4>{headerTitle}
                <img src={backButtonUrl} alt='tungsten' className={isListOpen ? "dropdown-imgopen" : "dropdown-imgclose"}></img>
            </h4>
            </button>
            {isListOpen && (
              <div
                role="list"
                className="dropdown-content"
              >
                {list.map((item) => (
                 <button key={item.id}
                    type="button"
                    className="dd-list-item"
                    onClick={(e) => {e.stopPropagation(); handleSelect(item.id)}}
                  >
                    {item.title}
                    {' '}
                    {item.selected && <img src={backButtonUrl} alt='tungsten'></img>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      

}


