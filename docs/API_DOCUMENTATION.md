# Smart City Connect - API Documentation

This directory contains the auto-generated documentation for the Smart City Connect microservices.

## 📚 Service Documentation

| Service | Protocol | Documentation File | Description |
|---------|----------|-------------------|-------------|
| **Mobility Service** | REST | [`mobility-service/openapi.json`](./mobility-service/openapi.json) | OpenAPI 3.0 specification for transport and mobility data. |
| **Air Quality Service** | SOAP | [`air-quality-service/air-quality.wsdl`](./air-quality-service/air-quality.wsdl) | WSDL definition for air quality data. |
| **Emergency Service** | gRPC | [`emergency-service/emergency.proto`](./emergency-service/emergency.proto) | Protocol Buffers definition for emergency alerts. |
| **Citizen Engagement** | GraphQL | [`citizen-engagement-service/schema.json`](./citizen-engagement-service/schema.json) | GraphQL Introspection Schema. |
| **AI Orchestrator** | REST | [`ai-orchestrator-service/openapi.json`](./ai-orchestrator-service/openapi.json) | OpenAPI 3.0 spec for the AI Chatbot and Orchestrator. |

## 🛠 How to Use

### REST Services (Mobility, AI Orchestrator)
- **Tool**: [Postman](https://www.postman.com/) or [Swagger UI](https://swagger.io/tools/swagger-ui/)
- **Instructions**: Import the `openapi.json` file directly into Postman to create a collection of requests.

### SOAP Service (Air Quality)
- **Tool**: [SoapUI](https://www.soapui.org/) or Postman
- **Instructions**: Import the `.wsdl` file. SoapUI will generate sample requests for all operations.

### gRPC Service (Emergency)
- **Tool**: [Postman](https://learning.postman.com/docs/sending-requests/grpc/grpc-request-interface/) or [BloomRPC](https://github.com/bloomrpc/bloomrpc)
- **Instructions**: Import the `.proto` file. You will need to configure the server address (e.g., `localhost:9093`).

### GraphQL Service (Citizen Engagement)
- **Tool**: [GraphiQL](http://localhost:8080/graphiql?path=/graphql) or Postman
- **Instructions**: Use the introspection schema or access the GraphiQL interface directly.

## 🔄 Updating Documentation

To regenerate these files from the running services, execute the script in the project root:

```bash
./generate_docs.sh
```
