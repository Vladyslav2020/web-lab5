import React, { useEffect, useState } from 'react';
import TodosListPage from './TodoListPage';
import { StateService } from './StateService';
import { QueryService } from './QueryService';
import Loader from './Loader';
import Message from './Message';
import { AuthService } from './AuthService';
import Header from './Header';

let client;

function App() {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState({ message: '', type: '' });
    const [state, setState] = useState({
        todos: [],
        editableTodo: {
            id: null,
            title: null,
            date: null,
            completed: false,
        },
    });
    const [authData, setAuthData] = useState({
        token: '',
        isAuthenticated: false,
        user: {},
        error: null,
        popupOpen: false,
    });

    const showLoader = () => {
        setLoading(true);
    };

    const hideLoader = () => {
        setLoading(false);
    };

    const showMessage = ({ type, message }) => {
        setReport({ type, message });
    };

    const hideMessage = () => {
        setReport({ message: '', type: '' });
    };

    const queryService = new QueryService(
        showLoader,
        hideLoader,
        showMessage,
        hideMessage,
        authData,
    );

    const stateService = new StateService(state, setState, queryService);
    const authService = new AuthService(
        authData,
        setAuthData,
        showMessage,
        hideMessage,
    );

    useEffect(async () => {
        try {
            setLoading(true);
            client = await authService.createClient();
            const user = await client.getUser();
            const isAuthenticated = await client.isAuthenticated();
            const accessToken = await client.getIdTokenClaims();
            if (accessToken) {
                setAuthData(prevState => ({
                    ...prevState,
                    user,
                    isAuthenticated,
                    token: accessToken.__raw,
                }));
            }
        } catch (err) {
            showMessage({
                message: 'Failed to fetch authentication data',
                type: 'danger',
            });
            setTimeout(hideMessage, 3000);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(async () => {
        if (authData.isAuthenticated) {
            await stateService.downloadTodos();
        }
    }, [authData]);

    const login = () => {
        authService.loginWithPopup(client);
    };

    const logout = () => {
        authService.logout(client);
    };

    return (
        <div className="App">
            <Header
                authData={authData}
                logout={logout}
                login={login}
                loading={loading}
            />
            <Message
                type={report.type}
                message={report.message}
                hideMessage={hideMessage}
            />
            {authData.isAuthenticated && (
                <TodosListPage
                    todos={state.todos}
                    editableTodo={state.editableTodo}
                    setEditableTodoId={stateService.setEditableTodoId}
                    setEditableTodoTitle={stateService.setEditableTodoTitle}
                    setEditableTodoCompleted={
                        stateService.setEditableTodoCompleted
                    }
                    clearEditableTodo={stateService.clearEditableTodo}
                    addNewTodo={stateService.addTodo}
                    updateTodo={stateService.updateTodo}
                    deleteTodo={stateService.deleteTodo}
                />
            )}
            {loading && <Loader />}
        </div>
    );
}

export default App;
