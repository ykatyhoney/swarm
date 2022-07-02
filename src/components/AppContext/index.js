import { useState, createContext } from 'react';

const Context = createContext();

const AppProvider = ({children}) => {
    const [selectedOption, setSelectedOption] = useState("seconds");
    return (
        <Context.Provider value={{selectedOption, setSelectedOption}}>
            {children}
        </Context.Provider>
    );
};

export { AppProvider, Context };