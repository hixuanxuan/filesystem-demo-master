import Datastore from 'nedb'
import path from 'path'
const { remote } = window.require('electron');
const { join } =window.require('path');

const nedb = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('documents'), 'db/userinfo.db')
})

export default nedb;