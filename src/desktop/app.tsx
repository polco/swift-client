import * as Mobx from 'mobx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'shared/styles/core.less';
import Main from './views/Main';

Mobx.useStrict(true);

localStorage.setItem('debug', 'swift*');

const div = document.getElementById('swift');
div!.classList.add('desktop');
ReactDOM.render(<Main />, div);
