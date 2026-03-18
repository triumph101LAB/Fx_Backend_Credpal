rc/app.module.ts:21:9 - error TS2322: Type 'string | number' is not assignable to type 'number | undefined'.
  Type 'string' is not assignable to type 'number'.

21         port: process.env.REDIS_PORT || 6379,
           ~~~~

[11:49:46 AM] Found 1 error. Watching for file changes.     
