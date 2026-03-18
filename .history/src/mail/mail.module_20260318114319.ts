[Nest] 1280  - 03/18/2026, 11:41:53 AM   ERROR [ExceptionHandler] UnknownDependenciesException [Error]: Nest can't resolve dependencies of the TRANSACTION_REPOSITORY (?). Please make sure that the argument "DataSource" at index [0] is available in the TransactionModule module.

Potential solutions:
- Is TransactionModule a valid NestJS module?
- If "DataSource" is a provider, is it part of the current TransactionModule?
- If "DataSource" is exported from a separate @Module, is that module imported within TransactionModule?
  @Module({
    imports: [ /* the Module containing "DataSource" */ ]
  })

For more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors
    at Injector.lookupComponentInParentModules (C:\Users\DELL\Desktop\CredPal\cred-pal\node_modules\@nestjs\core\injector\injector.js:290:19)     
    at async resolveParam (C:\Users\DELL\Desktop\CredPal\cred-pal\node_modules\@nestjs\core\injector\injector.js:140:38)
    at async Promise.all (index 0)
    at async Injector.resolveConstructorParams (C:\Users\DELL\Desktop\CredPal\cred-pal\node_modules\@nestjs\core\injector\injector.js:169:27)     
    at async Injector.loadInstance (C:\Users\DELL\Desktop\CredPal\cred-pal\node_modules\@nestjs\core\injector\injector.js:75:13)
    at async Injector.loadProvider (C:\Users\DELL\Desktop\CredPal\cred-pal\node_modules\@nestjs\core\injector\injector.js:103:9)
    at async C:\Users\DELL\Desktop\CredPal\cred-pal\node_modules\@nestjs\core\injector\instance-loader.js:56:13
    at async Promise.all (index 4)
    at async InstanceLoader.createInstancesOfProviders (C:\Users\DELL\Desktop\CredPal\cred-pal\node_modules\@nestjs\core\injector\instance-loader.js:55:9)
    at async C:\Users\DELL\Desktop\CredPal\cred-pal\node_modules\@nestjs\core\injector\instance-loader.js:40:13 {
  type: 'TRANSACTION_REPOSITORY',
  context: {
    index: 0,
    dependencies: [
      'DataSource'
    ],
    name: 'DataSource'
  },
  metadata: {
    id: '238df1663c662d041c279'
  },
  moduleRef: {
    id: '1e3a8a5ff4c4497e85f4c'
  }