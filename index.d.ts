/**
 * Configuration options for the filezord project aggregation.
 */
export interface FilezordOptions {
    ignoreFile?: string;
    autoIgnore?: boolean;
    id?: string | null;
    include?: string[];
    exclude?: string[];
    maxFileSize?: number;
    includeHidden?: boolean;
    globalHeader?: string;
    fileHeader?: string;
  }
  
  /**
   * Aggregates all non-binary text files in a project into a single structured output.
   * 
   * @param dir - The root directory to process.
   * @param options - Configuration options for file aggregation.
   * @returns A promise that resolves to the aggregated string output.
   */
  export function filezordProject(
    dir: string,
    options?: FilezordOptions
  ): Promise<string>;
  
  /**
   * Executes the filezordProject function and handles output logic (console or file writing).
   * 
   * @param dir - The root directory to process.
   * @param options - Configuration options for file aggregation and output handling.
   * @returns A promise that resolves when execution is complete.
   */
  export function filezordProjectExec(
    dir: string,
    options?: FilezordOptions
  ): Promise<void>;
  