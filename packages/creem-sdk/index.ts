import crypto from 'crypto';
import { ActivateLicenseParams, CancelSubscriptionParams, CheckoutSession, CreateBillingPortalSessionParams, CreateCheckoutSessionParams, CreateDiscountParams, CreateProductParams, Customer, DeactivateLicenseParams, DiscountCode, GetSubscriptionParams, LicenseActivation, LicenseDeactivation, LicenseValidation, Product, ProductListResponse, ProductSearchParams, Subscription, TransactionListResponse, TransactionSearchParams, ValidateLicenseParams } from './types';

interface RedirectParams {
    request_id?: string | null;
    checkout_id?: string | null;
    order_id?: string | null;
    customer_id?: string | null;
    subscription_id?: string | null;
    product_id?: string | null;
}

export class CreemSDK {
    private apiKey: string;
    private baseUrl: string;

    constructor({ apiKey }: { apiKey: string }) {
        if (!apiKey.startsWith('creem_')) {
            throw new Error('Invalid API key format. API key must start with "creem_"');
        }

        this.apiKey = apiKey;
        const mode = apiKey.startsWith('creem_test_') ? 'test' : 'live';
        this.baseUrl = mode === 'test'
            ? 'https://test-api.creem.io'
            : 'https://api.creem.io';
    }

    private async request<T, P = Record<string, unknown>>(
        endpoint: string,
        method: 'GET' | 'POST' = 'GET',
        data?: P
    ): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
            },
            ...(data && { body: JSON.stringify(data) }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Request failed');
        }

        return response.json();
    }

    async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSession> {
        return this.request<CheckoutSession, CreateCheckoutSessionParams>('/v1/checkouts', 'POST', params);
    }

    async getCustomer(params: { customer_id?: string; email?: string }): Promise<Customer> {
        const queryParams = new URLSearchParams();
        if (params.customer_id) {
            queryParams.append('customer_id', params.customer_id);
        }
        if (params.email) {
            queryParams.append('email', params.email);
        }
        return this.request<Customer>(`/v1/customers?${queryParams.toString()}`);
    }

    async getSubscription(params: GetSubscriptionParams): Promise<Subscription> {
        const queryParams = new URLSearchParams({ subscription_id: params.subscription_id });
        return this.request<Subscription>(`/v1/subscriptions?${queryParams.toString()}`);
    }

    async cancelSubscription(params: CancelSubscriptionParams): Promise<Subscription> {
        return this.request<Subscription>(
            `/v1/subscriptions/${params.id}/cancel`,
            'POST'
        );
    }

    verifyWebhookSignature(
        payload: string,
        signature: string,
        webhookSecret: string
    ): boolean {
        const computedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(payload)
            .digest('hex');

        return computedSignature === signature;
    }

    verifyRedirectSignature(params: RedirectParams, signature: string): boolean {
        const data = Object.entries(params)
            .filter(([_, value]) => value !== null && value !== undefined)
            .map(([key, value]) => `${key}=${value}`)
            .concat(`salt=${this.apiKey}`)
            .join('|');

        const computedSignature = crypto
            .createHash('sha256')
            .update(data)
            .digest('hex');

        return computedSignature === signature;
    }

    // License Key Management
    async activateLicense(params: ActivateLicenseParams): Promise<LicenseActivation> {
        return this.request<LicenseActivation, ActivateLicenseParams>(
            '/v1/licenses/activate',
            'POST',
            params
        );
    }

    async deactivateLicense(params: DeactivateLicenseParams): Promise<LicenseDeactivation> {
        return this.request<LicenseDeactivation, DeactivateLicenseParams>('/v1/licenses/deactivate', 'POST', params);
    }

    async validateLicense(params: ValidateLicenseParams): Promise<LicenseValidation> {
        return this.request<LicenseValidation, ValidateLicenseParams>('/v1/licenses/validate', 'POST', params);
    }

    // Products
    async createProduct(params: CreateProductParams): Promise<Product> {
        return this.request<Product, CreateProductParams>('/v1/products', 'POST', params);
    }

    async getProduct(productId: string): Promise<Product> {
        return this.request<Product>(`/v1/products/${productId}`);
    }

    async listProducts(params?: ProductSearchParams): Promise<ProductListResponse> {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, value.toString());
                }
            });
        }
        return this.request<ProductListResponse>(
            `/v1/products/search?${queryParams.toString()}`
        );
    }

    // Discount Codes
    async createDiscountCode(params: CreateDiscountParams): Promise<DiscountCode> {
        return this.request<DiscountCode, CreateDiscountParams>('/v1/discounts', 'POST', params);
    }

    // Transactions
    async listTransactions(params?: TransactionSearchParams): Promise<TransactionListResponse> {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, value.toString());
                }
            });
        }
        return this.request<TransactionListResponse>(
            `/v1/transactions/search?${queryParams.toString()}`
        );
    }

    // File Downloads
    async getFileDownloadUrl(fileId: string): Promise<{ download_url: string }> {
        return this.request<{ download_url: string }>(`/v1/files/${fileId}/download`);
    }

    // Private Notes
    async getPrivateNotes(productId: string): Promise<{ notes: string }> {
        return this.request<{ notes: string }>(`/v1/products/${productId}/notes`);
    }

    async createBillingPortalSession(params: CreateBillingPortalSessionParams): Promise<{ customer_portal_link: string }> {
        return this.request<{ customer_portal_link: string }, CreateBillingPortalSessionParams>(
            '/v1/customers/billing',
            'POST',
            params
        );
    }
}

export * from './types';
