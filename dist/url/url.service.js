"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../providers/prisma");
const cache_manager_1 = require("@nestjs/cache-manager");
let UrlService = class UrlService {
    constructor(pirsmasService, chacheManeger) {
        this.pirsmasService = pirsmasService;
        this.chacheManeger = chacheManeger;
    }
    async createShortUrl(createUrlDto) {
        const { original_url, custom_code } = createUrlDto;
        const shortUrl = custom_code || Math.random().toString(36).substring(2, 8);
        const codeExist = await this.pirsmasService.url.findUnique({
            where: {
                short_url: shortUrl,
            },
        });
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 5);
        if (codeExist) {
            throw new common_1.ConflictException('Short code already exist');
        }
        const newUrl = await this.pirsmasService.url.create({
            data: {
                origin_url: original_url,
                short_url: shortUrl,
                expiration_date: expirationDate,
            },
        });
        return newUrl;
    }
    async getOriginUrl(shortUrl) {
        console.log(`chache before rettrieval ${shortUrl}`);
        const cacheUrl = await this.chacheManeger.get(shortUrl);
        console.log(`chache after rettrieval ${cacheUrl}`);
        if (cacheUrl) {
            return cacheUrl;
        }
        const url = await this.pirsmasService.url.findUnique({
            where: {
                short_url: shortUrl,
            },
        });
        if (!url) {
            throw new common_1.NotFoundException('Url not found');
        }
        if (new Date() > url.expiration_date) {
            await this.pirsmasService.url.delete({
                where: {
                    short_url: shortUrl,
                },
            });
            throw new common_1.GoneException('Url expired');
        }
        console.log(shortUrl);
        await this.chacheManeger.set(shortUrl, url.origin_url, 3600);
        return url.origin_url;
    }
};
exports.UrlService = UrlService;
exports.UrlService = UrlService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_1.PrismaService, Object])
], UrlService);
//# sourceMappingURL=url.service.js.map