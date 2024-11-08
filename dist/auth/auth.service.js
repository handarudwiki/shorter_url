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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../providers/prisma");
const bcrypt_1 = require("../common/helpers/bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(prismaService, jwtService) {
        this.prismaService = prismaService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, name } = registerDto;
        const isUserExist = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });
        if (isUserExist) {
            throw new common_1.ConflictException('Email already exist');
        }
        const hashedPassword = await (0, bcrypt_1.hashPassword)(password);
        try {
            const user = await this.prismaService.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            });
            return {
                data: user,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Something went wrong');
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const isUserExist = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });
        if (!isUserExist) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPaasswordFalid = await (0, bcrypt_1.comparePasswords)(password, isUserExist.password);
        if (!isPaasswordFalid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return {
            token: this.jwtService.sign({ email, id: isUserExist.id }),
        };
    }
    async getUser(id) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            data: user,
        };
        throw new common_1.InternalServerErrorException('Something went wrong');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map