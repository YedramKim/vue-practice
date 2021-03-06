let vm = new Vue({
	el: '#directive',
	data: {
		message: 's'
	},
	directives: {
		focus: {
			inserted(el, binding, vnode, ...props) {
				console.log(vnode);
				if (binding.modifiers.bind) {
					el.value = binding.value;
				}
				el.focus();
			}
		}
	}
});