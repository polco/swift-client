import Action, { actionType } from './Action';
import CreateSession from './CreateSession';

const actions: { [K in actionType]: {
	new(...p: any[]): Action;
} } = {
	createSession: CreateSession
};

export default actions;
