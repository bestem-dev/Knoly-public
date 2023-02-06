## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## DB management
We use prisma

to set up dev db:
Uncomment corresponding url in `.env` (and comment the rest)
```bash
npx prisma migrate dev
```

## Running scripts

```bash
ts-node path/to/script.ts
```

or:

```bash
yarn script path/to/script.ts
```

### Scripts
- `scripts/createSkills.ts` creates skills for the db
