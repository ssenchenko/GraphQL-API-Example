.PHONY: build

update-schema:
	aws s3 cp schema.graphql s3://graph-ql-demo

update-resolvers:
	aws s3 sync ./resolvers s3://graph-ql-demo/resolvers/

build:
	sam build

deploy: build
	sam deploy
