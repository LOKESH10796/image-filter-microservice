"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const pino_http_1 = __importDefault(require("pino-http"));
const zod_1 = require("zod");
const util_1 = require("./util/util");
async function main() {
    const app = (0, express_1.default)();
    const port = process.env.PORT || 8082;
    // Middleware
    app.use(body_parser_1.default.json());
    app.use((0, pino_http_1.default)({
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true
            }
        }
    }));
    // Input Validation Schema
    const QuerySchema = zod_1.z.object({
        image_url: zod_1.z.string().url("Must be a valid URL")
    });
    // Healthcheck / Root
    app.get('/', (_req, res) => {
        res.status(200).json({
            message: 'Welcome to the High-Performance Image Filter Microservice',
            endpoints: [
                'GET /filteredimage?image_url={public_url}'
            ]
        });
    });
    // Primary Processing Endpoint
    app.get('/filteredimage', async (req, res) => {
        try {
            // 1. Validate Input using Zod
            const { image_url } = QuerySchema.parse(req.query);
            // 2. Process Image (Fetch + Sharp)
            const filePath = await (0, util_1.filterImageFromURL)(image_url);
            // 3. Send File and Cleanup asynchronously
            res.status(200).sendFile(filePath, (err) => {
                if (err) {
                    req.log.error(err, 'Error sending file');
                }
                (0, util_1.deleteLocalFiles)([filePath]);
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    error: 'Bad Request',
                    details: error.issues
                });
            }
            req.log.error(error, 'Image processing failed');
            return res.status(422).json({
                error: 'Unprocessable Entity',
                message: 'Unable to process the provided image URL. Ensure it points to a valid public image.'
            });
        }
    });
    // Start Server
    app.listen(port, () => {
        console.log(`🚀 Microservice running optimally on http://localhost:${port}`);
        console.log('Press CTRL+C to stop server');
    });
}
main().catch(console.error);
//# sourceMappingURL=server.js.map