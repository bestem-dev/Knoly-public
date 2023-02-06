import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { Context, createContext } from './context';
import { userRouter } from './routers/users';
import { supportRouter } from './routers/support';
import { createRouter } from './createRouter';
import { PoKRouter } from './routers/PoK';

export const appRouter = createRouter()
  .merge("user.", userRouter)
  .merge("support.", supportRouter)
  .merge("pok.", PoKRouter)

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});