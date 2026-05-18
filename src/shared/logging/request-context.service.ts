import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

interface RequestContextStore {
  requestId: string;
  traceId: string;
  method?: string;
  path?: string;
}

@Injectable()
export class RequestContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<RequestContextStore>();

  run(store: RequestContextStore, callback: () => void): void {
    this.asyncLocalStorage.run(store, callback);
  }

  getStore(): RequestContextStore | undefined {
    return this.asyncLocalStorage.getStore();
  }

  getTraceId(): string | undefined {
    return this.getStore()?.traceId;
  }

  getRequestId(): string | undefined {
    return this.getStore()?.requestId;
  }
}
