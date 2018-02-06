import * as PropTypes from 'prop-types';
import Store from './Store';

export type Context = {
	store: Store
};

export const contextTypes: {[T in keyof Context]: PropTypes.Requireable<any>} = {
	store: PropTypes.object
};
