var getRowsCount = function() {
  return Math.round(window.innerHeight / 16) - 1;
};

var getColumnsCount = function() {
  return Math.round(window.innerWidth / 11) - 1;
};

var cols=getColumnsCount(),
    rows = getRowsCount();

var terminalContainer = document.getElementById('terminal-container'),
    term = new Terminal({
      rows: getRowsCount()
    }),
    socket,
    termid;

window.onresize = function(event) {
    term.resize(getColumnsCount(), getRowsCount());
};

term.open(terminalContainer);
term.fit();

term.toggleFullscreen();

if (document.location.pathname) {
  var parts = document.location.pathname.split('/')
    , base = parts.slice(0, parts.length - 1).join('/') + '/'
    , resource = base.substring(1) + 'socket.io';

  socket = io.connect(null, { resource: resource });
} else {
  socket = io.connect();
}

socket.emit('create', cols, rows, function(err, data) {
  if (err) return self._destroy();
  self.pty = data.pty;
  self.id = data.id;
  termid = self.id;
  term.emit('open tab', self);
});

term.writeln('Welcome to xterm.js');
term.writeln('Connecting to websocket...');

term.on('data', function(data) {
  socket.emit('data', termid, data);
});

term.on('resize', function(data) {
  socket.emit('resize', termid, term.cols, term.rows);
});

socket.on('connect', function() {
  term.writeln('Connected.');
  term.writeln('');
  var search = window.location.search;

  setTimeout(function() {
    if (search) {
      term.send(decodeURIComponent(window.location.search).split('command=').pop() + '\n');
    }
  }, 300);
});

socket.on('data', function(id, data) {
  term.write(data);
});
