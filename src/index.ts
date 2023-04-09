import * as ConfigFile from "./config"
import * as decolib from "./lib/decoration"

import cluster from 'cluster';
import os from 'os';

import * as GLOBAL from "./global"

const app = GLOBAL.app
const port = ConfigFile.config.port;

function console_send(caller:string,message:string){
  console.log(decolib.message_formated(caller,message));
}

function worker_send(id:any,message:string){
  console_send(`${decolib.prefixes.Worker} ${id}`,message)
}


if (cluster.isPrimary) {
    const numWorkers = ConfigFile.config.allocated_threads //os.cpus().length;
    console_send(decolib.prefixes.Program,`starting webserver ✅`)
    console_send(decolib.prefixes.Program,`starting with ${numWorkers} ${decolib.prefixes.Worker_Plural}`)
  
    Array.from({ length: numWorkers }, () => cluster.fork());
  
    cluster.on('exit', (worker, code, signal) => {
      worker_send(worker.process.pid,`exited with code ${code}`)

      console.log(`Starting a new worker`);
      cluster.fork();
    });
  } else {
    app.get('/', (req, res) => {
      if (cluster.worker) {
        //res.send(`Hello bello from worker ${cluster.worker.id}`);
        res.send(`<h3>TEST<h3>`)
      } else {
        res.send('Hello from a worker');
      }
    });
  
    app.listen(port, () => {
      if (cluster.worker) {
        worker_send(cluster.worker.id,`listening on port ${port} 🔌`)
      } else {
        console.log(`Listening on port ${port}`);
      }
    });
    
  }
