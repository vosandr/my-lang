// let x = 45 + ( foo * bar )
// [ LetToken, IdentifierTk, EqualsToken, NumberToken ]
// import Deno from 'deno';
import fs from 'node:fs';
export enum TokenType {
  // Literal Types
  Number,
  Ident,

  // Keywords
  Let,
  Const,
  Fn,

  // Grouping * Operators
  Equals,
  Semicol,
  Comma,
  Dot,
  Colon,
  OpParen,// (
  ClParen,// )
  OpenBrace,// {
  CloseBrace,// }
  ClBracket,// ]
  OpBracket,// [
  BinOprtr,
  EOF,
  Identifier
}

const KEYWORDS: Record<string, TokenType> = {
  suf: TokenType.Let,
  con: TokenType.Const,
  fn: TokenType.Fn,
}

export interface Token {
  value: string;
  type: TokenType;

}

function token(value="", type: TokenType): Token {
  return { value, type };
}

function isalpha(src: string) {
  return src.toUpperCase() != src.toLowerCase();
}

function isint(str: string) {
  const c = str.charCodeAt(0);
  const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
  return (c >= bounds[0] && c <= bounds[1]);
}

function isskipppable(str: string) {
  return str == " " || str == '\n' || str == '\t' || str == "\r";
}

export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("");

  // Build each until end of file
  while (src.length > 0) {

    // const SIGNS: Record<string, TokenType> = {
    //   "(": TokenType.OpParen,
    //   ")": TokenType.ClParen,
    //   "{": TokenType.OpenBrace,
    //   "}": TokenType.CloseBrace,
    //   "[": TokenType.OpBracket,
    //   "]": TokenType.ClBracket,
    // }
    if (src[0] == '(') {
      tokens.push(token(src.shift(), TokenType.OpParen));
    } 
    else if (src[0] == ')') {
      tokens.push(token(src.shift(), TokenType.ClParen));
    }

    else if (src[0] == '{') {
      tokens.push(token(src.shift(), TokenType.OpenBrace))
    }

    else if (src[0] == '}') {
      tokens.push(token(src.shift(), TokenType.CloseBrace))
    }
    else if (src[0] == '[') {
      tokens.push(token(src.shift(), TokenType.OpBracket))
    }

    else if (src[0] == ']') {
      tokens.push(token(src.shift(), TokenType.ClBracket))
    }

    else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%") {
      tokens.push(token(src.shift(), TokenType.BinOprtr));
    }

    else if (src[0] == "=") {
      tokens.push(token(src.shift(), TokenType.Equals));
    }

    else if (src[0] == ";") {
      tokens.push(token(src.shift(), TokenType.Semicol));
    }
    else if (src[0] == ":") {
      tokens.push(token(src.shift(), TokenType.Colon));
    }

    else if (src[0] == ",") {
      tokens.push(token(src.shift(), TokenType.Comma));
    }
    else if (src[0] == ".") {
      tokens.push(token(src.shift(), TokenType.Dot));
    }
    // else if (src[0] == "=>") {
    //   tokens.push(token(src.shift(), TokenType.Fn));
    // }
    else {
      // Handle multicharacter tokens

      if (isint(src[0])) {
        let num = "";
        while (src.length > 0 && isint(src[0])) {
          num += src.shift();
        }

        tokens.push(token(num, TokenType.Number));
      }
      else if (isalpha(src[0])) {
        let ident = ""; //foo Let
        while (src.length > 0 && isalpha(src[0])) {
          ident += src.shift();
        }
        // check for reserved keywords
        const reserved = KEYWORDS[ident];
        if (typeof reserved == "number") {
          tokens.push(token(ident, reserved));
        } 
        else {
          tokens.push(token(ident, TokenType.Ident));
        }
      } 
      else if (isskipppable(src[0])) {
        src.shift()
      } 
      else {
        throw console.error(`Unrecognized character found in source: ${src[0].charCodeAt(0)} ${src[0]}`);
      }

    }

  }
  tokens.push({ type: TokenType.EOF, value: "EndOfFile" })
  return tokens;
}

// const source = await Deno.readTextFile("./test.txt");
// for (const token of tokenize(source)) {
//   console.log(token);
// }

// const source = fs.readFileSync("./lexer.ts").toString();
// for (const token of tokenize(source)) {
//   console.log(token);
// }