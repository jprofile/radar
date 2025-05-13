declare module 'busboy' {
    import { IncomingHttpHeaders } from 'http';
    import { Readable } from 'stream';
  
    interface FileInfo {
      filename: string;
      encoding: string;
      mimeType: string;
    }
  
    interface BusboyEvents {
      on(event: 'file', listener: (fieldname: string, file: Readable, info: FileInfo) => void): this;
      on(event: 'field', listener: (fieldname: string, value: string, info: any) => void): this;
      on(event: 'finish', listener: () => void): this;
      on(event: 'close', listener: () => void): this;
      on(event: 'error', listener: (error: Error) => void): this;
    }
  
    interface BusboyOptions {
      headers: IncomingHttpHeaders;
    }
  
    export default function Busboy(options: BusboyOptions): BusboyEvents;
  }
  