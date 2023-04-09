import * as ConfigFile from "./config"
import * as decolib from "./lib/decoration"
import * as htmlreader from "./lib/htmlreader"

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


async function main() {
  console.log(htmlreader.getindex());
  if (cluster.isPrimary) {
    const numWorkers = ConfigFile.config.allocated_threads //os.cpus().length;
    console_send(decolib.prefixes.Program,`starting webserver ✅`)
    console_send(decolib.prefixes.Program,`starting with ${numWorkers} ${decolib.prefixes.Worker_Plural}`)
  
    Array.from({ length: numWorkers }, () => cluster.fork());
  
    cluster.on('exit', async (worker, code, signal) => {
      await worker_send(worker.process.pid,`exited with code ${code}`)

      console.log(`Starting a new worker`);
      await cluster.fork();
    });

  } else {
    app.get('/', async (req, res) => {
      if (cluster.worker) {
        try {
          const index = await htmlreader.getindex();
          res.send(index);
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      } else {
        res.send('Hello from a worker');
      }
    });
  
    await app.listen(port, async () => {
      if (cluster.worker) {
        await worker_send(cluster.worker.id,`listening on port ${port} 🔌`)
      } else {
        console.log(`Listening on port ${port}`);
      }
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
