import * as trpc from '@trpc/server';
import { Context, createContext } from './context';

export const createRouter = () => {
  return trpc.router<Context>();
}