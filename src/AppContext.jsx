import React, { createContext, useReducer, useEffect } from 'react';

export const AppContext = createContext();

const initialState = {
  habits: [],
  user: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, habits: [] }; // Reset habits on login
    case 'LOGOUT':
      return { ...state, user: null, habits: [] }; // Reset habits on logout
    case 'SET_HABITS':
      return { ...state, habits: action.payload };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id ? action.payload : habit
        ),
      };
    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
      };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    if (state.user && state.user.username) {
      const userKey = `habitTrackerState_${state.user.username}`;
      const localData = localStorage.getItem(userKey);
      if (localData) {
        dispatch({ type: 'SET_HABITS', payload: JSON.parse(localData).habits });
      }
    }
  }, [state.user]);

  useEffect(() => {
    if (state.user && state.user.username) {
      const userKey = `habitTrackerState_${state.user.username}`;
      localStorage.setItem(userKey, JSON.stringify({ habits: state.habits }));
    }
  }, [state.habits, state.user]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};