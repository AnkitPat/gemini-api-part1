import { createContext, useState } from "react";
export const Context = createContext({
    list: [],
    setList: () => {},
    lastUpdate: null
})
export const ContextWrapper = ({children}) => {
    const [list, setList] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(null);
    
    const updateList = (action) => {
        if (action.type === 'update-chat') {
            const foundItem = list.find(item => item.id === action.id);
            if (!foundItem.name) {
                foundItem.name = action.name
            }
            if (foundItem.conversation) {
                foundItem.conversation.push(action.message)
            } else {
                foundItem.conversation = [action.message]
            }
            setLastUpdate(new Date().toISOString())
            setList(list)
        } else if (action.type === 'add-new-chat') {
            setLastUpdate(new Date().toISOString())
            setList(list.concat([{id: action.id}]))
        } else if (action.type === 'update-name-chat') {
            const foundItem = list.find(item => item.id === action.id);
            foundItem.name = action.name
            setLastUpdate(new Date().toISOString())
            setList(list)
        }
    }

    return <Context.Provider value={{list, updateList}}>{children}</Context.Provider>
}