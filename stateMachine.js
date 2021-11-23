// const { toViewMode, toEditorMode } = require('./mutateView')
const machine = {
	state: 'EDITOR',
	transitions: {
		EDITOR: {
			switch() {
				this.state = 'VIEW'
				// toViewMode();
			}

		},
		VIEW: {
			switch() {
				this.state = 'EDITOR';
				// toEditorMode();
			},
		},
	},
	dispatch(actionName) {
		const action = this.transitions[this.state][actionName];

		if (action) {
			action.call(this);
		} else {
			console.log('invalid action');
		}
	},
};
// module.exports = modeStateMachine;