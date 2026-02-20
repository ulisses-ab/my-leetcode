export type Tests = {
  testcases: {
    input: unknown,
    output: unknown,
    hidden?: boolean
    [key: string]: unknown,
  }[]; 
  [key: string]: unknown;
}