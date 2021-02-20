<p align="center">
  <h1 align="center">nexus-args-validation</h1>
</p>

[![npm version](https://img.shields.io/npm/v/nexus-args-validation.svg?style=flat-square)](https://www.npmjs.org/package/nexus-args-validation)
[![npm downloads](https://img.shields.io/npm/dm/nexus-args-validation.svg?style=flat-square)](http://npm-stat.com/charts.html?package=nexus-args-validation)

This plugin integrates [yup](https://github.com/jquense/yup/) into [Nexus](https://nexusjs.org/).

# Installation

```bash
npm install nexus-args-validation
```

# Example

```typescript
import { join } from 'path'
import { ApolloServer } from 'apollo-server'
import { makeSchema, mutationField, stringArg } from 'nexus'
import { object, string } from 'yup'
import { nexusArgsValidation } from 'nexus-args-validation'

const types = [
  mutationField('validateUrl', {
    type: 'String',
    description: 'Validates the url argument as a valid URL via a regex',
    args: {
      url: stringArg(),
    },
    validation(yup) {
      return yup.object().shape({
        url: yup.url('Your url is not valid!'),
      })
    },
    resolve: (_, { url }) => {
      return `Your url: ${url} is valid!`
    },
  }),
]

const schema = makeSchema({
  types,
  plugins: [nexusArgsValidation()],
  outputs: {
    schema: join(__dirname, 'generated/schema.graphql'),
    typegen: join(__dirname, 'generated/nexus.ts'),
  },
})

new ApolloServer({
  schema,
}).listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at: http://localhost:4000`),
)
```
