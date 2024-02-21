import Parser from './frontend/parser.ts';
import Environment, { createGlobalEnv } from './runtime/environment.ts';
import { evaluate } from "./runtime/interpreter.ts"
run("./test.txt");

async function run(filename: string) {
  const parser = new Parser();
  const env = createGlobalEnv();

  const input = await Deno.readTextFile(filename);
  const program = parser.produceAST(input);
  console.log(program);
  const result = evaluate(program, env);
  console.log(result);
}

function repl() {
  const parser = new Parser();
  const env = createGlobalEnv();

  console.log("\nRepl v0.1");

  while (true) {
    const input = prompt(">");
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