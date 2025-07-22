
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ContextProvider from './context/context';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ContextProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </ContextProvider>
);