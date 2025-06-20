
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { generatePetNameInputSchema, addPetNameInputSchema } from './schema';
import { generatePetNames } from './handlers/generate_pet_names';
import { addPetName } from './handlers/add_pet_name';
import { getAllPetNames } from './handlers/get_all_pet_names';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  generatePetNames: publicProcedure
    .input(generatePetNameInputSchema)
    .query(({ input }) => generatePetNames(input)),
  addPetName: publicProcedure
    .input(addPetNameInputSchema)
    .mutation(({ input }) => addPetName(input)),
  getAllPetNames: publicProcedure
    .query(() => getAllPetNames()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
