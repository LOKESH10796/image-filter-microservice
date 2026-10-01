"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = require("./util/util");
async function main() {
    const app = (0, express_1.default)();
    const port = process.env.PORT || 8082;
    app.use(body_parser_1.default.json());
    app.get('/filteredimage', async (req, res) => {
        const url = req.query.image_url;
        if (!url) {
            return res.status(400).send('Image url is required');
        }
        try {
            const filePath = await (0, util_1.filterImageFromURL)(url);
            res.sendFile(filePath, () => {
                (0, util_1.deleteLocalFiles)([filePath]);
            });
        }
        catch (error) {
            return res.status(422).send('Try another image url');
        }
    });
    app.get('/', (_req, res) => {
        res.send('try GET /filteredimage?image_url={{}}');
    });
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log('press CTRL+C to stop server');
    });
}
main();
//# sourceMappingURL=server.js.map