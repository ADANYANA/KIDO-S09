import {buildSync} from 'esbuild';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
const root=dirname(fileURLToPath(import.meta.url));
const target=join(root,'actualizacion04.test.mjs');
buildSync({entryPoints:[join(root,'actualizacion04.test.ts')],outfile:target,bundle:true,platform:'node',format:'esm',packages:'external',tsconfig:join(root,'../tsconfig.json')});
const r=spawnSync(process.execPath,[target],{stdio:'inherit'});process.exit(r.status??1);
