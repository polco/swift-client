import Doc, { DocType } from './Doc';
import Session from './Session';
import User from './User';

const docClass: {[D in DocType]: {
	new(...args: any[]): Doc;
	instantiate(obj: any): Doc
}} = {
	session: Session,
	user: User
};

export default docClass;
