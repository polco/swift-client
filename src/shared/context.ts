import * as PropTypes from 'prop-types';
import RTCClient from './RTCClient';
import Store from './Store';

export type Context = {
	RTCClient: RTCClient,
	store: Store
};

export const contextTypes: {[T in keyof Context]: PropTypes.Requireable<any>} = {
	RTCClient: PropTypes.object,
	store: PropTypes.object
};
