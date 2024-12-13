import { Router } from "express";
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/filter", (request, response) => {
    response.sendFile(path.join(__dirname, "..", 'views', 'filter.html'));
});
router.get("/get", (request, response) => {
    response.sendFile(path.join(__dirname, "..", 'views', 'get.html'));
});
router.get("/post", (request, response) => {
    response.sendFile(path.join(__dirname, "..", 'views', 'post.html'));
});
router.get("/patch", (request, response) => {
    response.sendFile(path.join(__dirname, "..", 'views', 'patch.html'));
});
router.get("/put", (request, response) => {
    response.sendFile(path.join(__dirname, "..", 'views', 'put.html'));
});
router.get("/delete", (request, response) => {
    response.sendFile(path.join(__dirname, "..", 'views', 'delete.html'));
});

export default router;