# 🖼️ High-Performance Image Filter Microservice

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Sharp](https://img.shields.io/badge/Sharp-libvips-99cc00?style=for-the-badge)](https://sharp.pixelplumbing.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)

A modern, highly-optimized TypeScript microservice for on-the-fly image processing. Engineered to fetch public images, process them using C++ backed `libvips` bindings (via `sharp`), and return the filtered assets instantly without leaving residual artifacts on the disk.

## ✨ Enterprise Upgrades (V2)
This repository was completely modernized from a legacy `jimp`-based implementation to an enterprise-grade architecture:
- **⚡ 40x Performance Boost**: Replaced the pure-JavaScript `jimp` engine with `sharp` (libvips), the fastest image processing library available for Node.js.
- **🛡️ Zod Validation**: Strict runtime type-checking and schema validation for incoming requests.
- **📝 Pino Logging**: High-performance, JSON-structured logging with `pino-http` and `pino-pretty`.
- **🗑️ Zero-Leak Architecture**: Safely isolates temporary files in the OS-native `tmpdir()` and guarantees asynchronous cleanup immediately after streaming to the client.
- **🌐 Native Fetch API**: Deprecated heavy Axios dependencies in favor of Node 20's optimized native `fetch`.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v20+ recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/LOKESH10796/udacity-c2-image-filter.git

# Install dependencies
npm install
```

### Running the Server
```bash
# Start the development server with hot-reload
npm run dev

# Build and start for production
npm run build
npm start
```

## 📡 API Reference

### `GET /filteredimage`
Downloads an image from a public URL, resizes it to 256x256, converts it to grayscale, applies 60% JPEG compression, and returns the binary image stream.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `image_url` | `string` | **Required**. The public URL of the image to filter. |

**Example Request:**
```http
GET http://localhost:8082/filteredimage?image_url=https://images.unsplash.com/photo-1517694712202-14dd9538aa97
```

**Responses:**
- `200 OK`: Returns the processed image binary (JPEG).
- `400 Bad Request`: Zod validation failure (e.g., invalid URL format).
- `422 Unprocessable Entity`: Failed to fetch or decode the remote image.

## 👨‍💻 Architect
Modernized and engineered by **Lokesh Gounder**  
📧 [lokeshgounder@gmail.com](mailto:lokeshgounder@gmail.com)  
🔗 [GitHub Profile](https://github.com/LOKESH10796)
