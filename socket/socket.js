module.exports = function (socket) {
	// broadcast a user's message to other users
	socket.on('send:message', function(data) {
		console.log('send:message');
		console.log(data);
		socket.broadcast.emit('send:message', data);
	});

	// broadcast a user's message to other users
	socket.on('user:typing', function(data) {
		socket.broadcast.emit('user:typing', {
			author_name: data,
		});
	});

	// broadcast a user's message to other users
	socket.on('user:finished_typing', function(data) {
		socket.broadcast.emit('user:finished_typing');
	});
};
