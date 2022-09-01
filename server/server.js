import express from 'express';
import fs from 'fs';
import path from 'path';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from '../src/App';

const app = express();

app.use('^/$', (req, res, next) => {
  fs.readFile(path.resolve('./build/index.html'), 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Some error happened');
    }

    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<script></script><div id="root">${ReactDOMServer.renderToPipeableStream(<App />)}</div>`,
      ),
    );
  });
});

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.listen(process.env.PORT || 8000, function () {
  console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env);
});
