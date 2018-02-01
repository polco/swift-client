import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from './views/Main';

localStorage.setItem('debug', 'swift*');

ReactDOM.render(<Main />, document.getElementById('swift'));
