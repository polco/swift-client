import Action from './Action';

class UpdateSessionName extends Action {
	private id: string;
	private name: string;

	constructor(id: string, name: string) {
		super('updateSessionName');

		this.id = id;
		this.name = name;
	}

	protected execute() {
		const session = this.store.getSession(this.id);
		session.name = this.name;
		return true;
	}
}

export default UpdateSessionName;
