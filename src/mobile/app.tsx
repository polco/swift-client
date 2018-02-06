import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'shared/styles/core.less';
import Main from './views/Main';

localStorage.setItem('debug', 'swift*');

const div = document.getElementById('swift');
div!.classList.add('mobile');
ReactDOM.render(<Main />, div);
