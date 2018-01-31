import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Home from './views/Home';

localStorage.setItem('debug', 'swift*');

ReactDOM.render(<Home />, document.getElementById('swift'));
