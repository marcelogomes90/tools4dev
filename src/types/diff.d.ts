declare module 'diff' {
  export interface Change {
    value: string;
    added?: boolean;
    removed?: boolean;
    count?: number;
  }

  export interface CreatePatchOptions {
    context?: number;
  }

  export function diffLines(oldText: string, newText: string): Change[];
  export function createPatch(
    fileName: string,
    oldText: string,
    newText: string,
    oldHeader?: string,
    newHeader?: string,
    options?: CreatePatchOptions,
  ): string;
}
