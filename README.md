### First Deployment 
1. Create a bucket to store code
```
aws s3api create-bucket --bucket graph-ql-demo --region us-west-2 --create-bucket-configuration LocationConstraint=us-west-2 --acl private
```

2.Upload schema 
```
aws s3 cp schema.graphql s3://graph-ql-demo
```

3. Upload resolvers code
```
aws s3 sync ./resolvers s3://graph-ql-demo/resolvers/
```

3. Upload functions code

Functions are building blocks for pipeliene resolvers.
```
aws s3 sync ./functions s3://graph-ql-demo/functions/
```

4. Deploy stack
```
sam deploy
```

### Schema update
It's not enough to simply upload new schema definition. The schema resource should be changed to trigger AppSync change. The only way to trigger schema change if schema definition is in s3, is to change the path.

### Papercuts

1. Schema update (see above)
2. Function (in pipeline resolver) do not update if code @S3 was updated (check it)
3. pipeline resolvers do not require DataSource
3. if Code is used instead of templates but forgot `runtime` the error is not `You forgot runtime` but `Code not supported when using templates.`
4. Doc doesn't say that `FunctionId` is required for `PipelineConfig`. Apparently ARN doesn't work
5. If you make a typo in the Property name you receive error `The code contains one or more errors. (Service: AWSAppSync; Status Code: 400; Error Code: BadRequestException` instead of a wrong property name
6. Can use Code on Unit Resolver but cannot use Environment on it. Without Environment, impossible to create a JS resolver. So Unit resolvers support only VTL. But docs are not explicit about it. https://docs.aws.amazon.com/appsync/latest/APIReference/API_Resolver.html
7. API Keys should be referable through intrinsic functions to a lambda's env


