interface ExpressRequest {
    body: any;
    user?: {
        id: string;
    };
}
interface ExpressResponse {
    status: (code: number) => ExpressResponse;
    json: (data: any) => void;
}
declare const registerUser: (req: ExpressRequest, res: ExpressResponse) => Promise<void>;
declare const loginUser: (req: ExpressRequest, res: ExpressResponse) => Promise<void>;
declare const getProfile: (req: ExpressRequest, res: ExpressResponse) => Promise<void>;
declare const updateUserProfile: (req: ExpressRequest, res: ExpressResponse) => Promise<void>;
export { registerUser, loginUser, updateUserProfile, getProfile };
declare const _default: {
    registerUser: (req: ExpressRequest, res: ExpressResponse) => Promise<void>;
    loginUser: (req: ExpressRequest, res: ExpressResponse) => Promise<void>;
    updateUserProfile: (req: ExpressRequest, res: ExpressResponse) => Promise<void>;
    getProfile: (req: ExpressRequest, res: ExpressResponse) => Promise<void>;
};
export default _default;
//# sourceMappingURL=authController.d.ts.map