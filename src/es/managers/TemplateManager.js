let tlManager = {
	templates: {}, //bubble_defauls will be registered here
	render: function (renderer, data) {
		let renderFunc;

		if (typeof renderer === 'function') {
			renderFunc = renderer;
		} else if (typeof renderer === 'string' && typeof this.templates[renderer] === 'function') {
			renderFunc = this.templates[renderer];
		} else {
			throw new Error('Bubble rendering failed - template "' + renderer + '" is not a function.');
		}
		return renderFunc(data);
	}
};

export default tlManager;