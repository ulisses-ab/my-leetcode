import swaggerUi from "swagger-ui-express";
import openapiSpec from "./openapi.json";

export function useSwagger(app: any) {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
}