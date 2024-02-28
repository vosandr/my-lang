import * as rl from 'readline-sync';
import Parser from './frontend/parser.ts';
import Environment, { createGlobalEnv } from './runtime/environment.ts';
import { evaluate } from "./runtime/interpreter.ts"
import fs from "node:fs";
// run("./test.txt");
repl();
async function run(filename: string) {
  const parser = new Parser();
  const env = createGlobalEnv();

  const input = fs.readFileSync(filename).toString();
  const program = parser.produceAST(input);
  console.log(program);
  const result = evaluate(program, env);
  console.log(result);
}

async function repl() {
  const parser = new Parser();
  const env = createGlobalEnv();

  console.log("\nRepl v0.1");
  while (true) {
    
    // let input;
    // process.stdout.write('> ');

    // process.stdin.on("data", data=>{
    //   input += data;
    // }).on('close', (data) => {
      
    //   process.exit();
    // })
    const input = rl.question('> ');
    
    // Check for no user input or exit keyword.
    if (!input || input.includes("exit")) {
      throw (`Exit from program`);
    }

    const program = parser.produceAST(input);
    // console.log(program);

    const result = evaluate(program, env);
    console.log(result);
  }
}