import { 
  Stmt,
  Program, 
  Expr, 
  BinaryExpr, 
  NumericLiteral, 
  Identifier,
  VarDeclaration,
  AssignmentExpr
} from './ast.ts';
import { tokenize, Token, TokenType } from './lexer.ts';
// import Deno from 'deno';
export default class Parser {
  private tokens: Token[] = [];
  private not_eof(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  private at () {
    return this.tokens[0] as Token;
  }

  private eat () {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  private expect (type: TokenType, err: any) {
    const prev = this.tokens.shift() as Token;
    if(!prev||prev.type!=type) {
      `Parser Error:\n${err + prev} - Expecting: ${type}`
    }

    return prev;
  }

  // fooBar

  public produceAST (sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    }

    // Parse until end of file 
    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }
    return program;
  }
  private parse_stmt (): Stmt {
    // skip to parse_expr
    switch (this.at().type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.parse_var_declaration();
      default:
        return this.parse_expr();
    } 

  }

  parse_var_declaration(): Stmt {
    const isConstant = this.eat().type==TokenType.Const;
    const identifier = this.expect(TokenType.Identifier, "Expected identifier name following let | const keywords.").value;
    if(this.at().type==TokenType.Semicolon) {
      this.eat();
      if (isConstant) {
        throw(`Must assign value to constant expression. No value provided.`)
      }
      return { kind: "VarDeclaration", identifier, constant: false } as VarDeclaration;
    }

    this.expect(TokenType.Equals, `Expected equals token following identifier in var declaration.`);

    const declaration = { 
      kind: "VarDeclaration",
      value: this.parse_expr(),
      identifier,
      constant: isConstant 
    } as VarDeclaration;

    this.expect(TokenType.Semicolon, `Variable declaration statement must end with semicolon.`);
    
    return declaration;
  }



  private parse_expr (): Expr {
    return this.parse_assignment_expr();

  }

  parse_assignment_expr(): Expr {
    const left = this.parse_additive_expr(); // switch this out with objectExpr 

    if(this.at().type==TokenType.Equals) {
      this.eat();
      const value = this.parse_assignment_expr();
      return { value, assigne: left, kind: "AssignmentExpr"} as AssignmentExpr;
    }

    return left;
  }


  // 10 + 5 - 5
  private parse_additive_expr (): Expr {
    let left = this.parse_multiplicitave_expr();

    while (this.at().value=="+"||this.at().value=="-") {
      const operator = this.eat().value;
      const right = this.parse_multiplicitave_expr();
      left = {
        kind: "BinaryExpr",
        left, 
        right, 
        operator, 
      } as BinaryExpr
      
    }
    return left;
  }

  private parse_multiplicitave_expr (): Expr {
    let left = this.parse_primary_expr();

    while (this.at().value=="/"||this.at().value=="*" || this.at().value == "%") {
      const operator = this.eat().value;
      const right = this.parse_primary_expr();
      left = {
        kind: "BinaryExpr",
        left, 
        right, 
        operator, 
      } as BinaryExpr
      
    }
    return left;
  }

  // Orders of prescindence
  // AdditiveExpr
  // MultiplicitoveExpr
  // PrimaryExpr

  private parse_primary_expr (): Expr {
    const tk = this.at().type;

    switch (tk) {
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;
      case TokenType.Number:
        return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral;
      case TokenType.OpenParent: {
        this.eat(); // eat the opening parent
        const value = this.parse_expr();
        this.expect(TokenType.CloseParent, "Unexpected token found inside parenthesised expression. Expected closing parenthesis.",);
        return value;

      
      // case TokenType.Semicolon:
      }
      default:
        throw (`Unexpected token found during parsing! '${this.at().value}'`)
        // console.error("Unexpected token found during parsing!", this.at());
        // Deno.exit(1);
        // Tricks for compiler for TS
        // return {} as Stmt;
    }
  }
}