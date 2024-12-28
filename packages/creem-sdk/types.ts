export interface CreemConfig {
    apiKey: string;
}

export interface CustomField {
    type: 'text';
    key: string;
    label: string;
    optional?: boolean;
    text?: {
        max_length?: number;
        min_length?: number;
    };
}

export interface CheckoutSession {
    id: string;
    mode: 'test' | 'live' | 'sandbox';
    object: string;
    status: string;
    product: Product;
    checkout_url: string;
    success_url: string;
    request_id?: string;
    order?: {
        id: string;
        mode: 'test' | 'live' | 'sandbox';
        object: string;
        product: Product;
        amount: number;
        currency: string;
        status: 'pending' | 'paid';
        type: 'subscription' | 'purchase';
        created_at: string;
        updated_at: string;
        customer?: Customer;
        fx_amount?: number;
        fx_currency?: string;
        fx_rate?: number;
        affiliate?: string;
    };
    subscription?: Subscription;
    customer?: Customer;
    custom_fields?: CustomField[];
    metadata?: Record<string, any>[];
}

// Request type for creating a checkout session
export interface CreateCheckoutSessionParams {
    product_id: string;
    request_id?: string;
    discount_code?: string;
    customer?: {
        id: string;
        email?: string;
    };
    custom_field?: CustomField[];
    success_url?: string;
    metadata?: Record<string, any>[];
}

export interface WebhookEvent {
    id: string;
    type: string;
    data: {
        checkout_id?: string;
        order_id?: string;
        customer_id?: string;
        subscription_id?: string;
        product_id?: string;
    };
    signature: string;
}

export interface Customer {
    id: string;
    mode: 'test' | 'live' | 'sandbox';
    object: string;
    email: string;
    country: string;
    created_at: string;
    updated_at: string;
    name?: string;
}

export interface Subscription {
    id: string;  // Required - Unique identifier
    mode: 'test' | 'live' | 'sandbox';  // Required - Environment
    object: string;  // Required - Object type
    product: Product;  // Required - The product associated with the subscription
    customer: Customer;  // Required - The customer who owns the subscription
    collection_method: string;  // Required - The method used for collecting payments
    status: 'active' | 'canceled' | 'unpaid' | 'paused' | 'trialing';  // Required - Current status
    created_at: string;  // Required - Creation date
    updated_at: string;  // Required - Last update date
    last_transaction_id?: string;  // Optional - ID of the last paid transaction
    last_transaction_date?: string;  // Optional - Date of the last paid transaction
    next_transaction_date?: string;  // Optional - Date of next subscription charge
    current_period_start_date?: string;  // Optional - Start of current period
    current_period_end_date?: string;  // Optional - End of current period
    canceled_at?: string;  // Optional - Cancellation date if applicable
}

export interface ProductFeature {
    id: string;
    type: string;
    description: string;
}

export interface Product {
    id: string;
    mode: 'test' | 'live' | 'sandbox';
    object: string;
    name: string;
    description: string;
    price: number;  // The price in cents. 1000 = $10.00
    currency: string;  // Three-letter ISO currency code, uppercase
    billing_type: string;  // recurring or one-time
    billing_period: string;  // Required according to docs
    status: string;
    tax_mode: string;  // Required according to docs
    tax_category: string;  // Required according to docs
    product_url: string;  // Required according to docs
    created_at: string;
    updated_at: string;
    image_url?: string;  // Only png and jpg supported
    features?: ProductFeature[];
    default_success_url?: string;
}

export interface CreateProductParams {
    name: string;
    price: number; // in cents, minimum 100 (= $1.00)
    currency: string; // Three-letter ISO currency code
    billing_type: string;
    description?: string;
    image_url?: string;
    billing_period?: string;
    features?: ProductFeature[];
    tax_mode?: 'inclusive' | 'exclusive';
    tax_category?: string;
    default_success_url?: string;
    custom_field?: CustomField[];
}

export interface LicenseKey {
    id: string;
    key: string;
    status: 'active' | 'inactive';
    activation_limit: number;
    activations: number;
    expires_at?: string;
    created_at: string;
    metadata?: Record<string, unknown>;
}

export interface LicenseInstance {
    id: string;
    mode: 'test' | 'live' | 'sandbox';
    object: string;
    name: string;
    status: 'active' | 'deactivated';
    created_at: string;
}

export interface LicenseValidation {
    id: string;
    mode: 'test' | 'live' | 'sandbox';
    object: string;
    status: 'inactive' | 'active' | 'expired' | 'disabled';
    key: string;
    activation: number;  // The number of instances that this license key was activated
    activation_limit: number | null;  // Null if activations are unlimited
    expires_at: string | null;  // Null if it does not have an expiration date
    created_at: string;
    instance: LicenseInstance[] | null;  // Associated license instances
}

export interface ValidateLicenseParams {
    key: string;  // The license key to validate
    instance_id: string;  // Id of the instance to validate
}

export interface CreateDiscountParams {
    name: string;  // Required - The name of the discount
    type: 'percentage' | 'fixed';  // Required - The type of discount
    amount: number;  // Required - The fixed value for the discount (if type is "fixed")
    duration: 'forever' | 'once' | 'repeating';  // Required - The duration type
    code?: string;  // Optional - If left empty, a code will be generated
    currency?: string;  // Required if type is "fixed"
    percentage?: number;  // Required if type is "percentage"
    expiry_date?: string;  // Optional - The expiry date
    max_redemptions?: number;  // Optional - Maximum number of redemptions
    duration_in_months?: number;  // Optional - Required if duration is "repeating"
    applies_to_products?: string[];  // Optional - Product IDs this applies to
}

export interface DiscountCode {
    id: string;  // Required - Unique identifier
    mode: 'test' | 'live' | 'sandbox';  // Required - Environment
    object: string;  // Required - Object type
    status: 'active' | 'draft' | 'expired' | 'scheduled';  // Required - Discount status
    name: string;  // Required - Discount name
    code: string;  // Required - Unique discount code
    type: 'percentage' | 'fixed';  // Required - Discount type
    amount: number;  // Required - Discount amount
    percentage?: number;  // Optional - Percentage value
    expiry_date?: string;  // Optional - Expiry date
    max_redemptions?: {
        limit: number;
        used: number;
    };  // Optional - Redemption limits
    duration?: 'forever' | 'once' | 'repeating';  // Optional - Duration type
    duration_in_months?: number;  // Optional - Number of months for repeating
    applies_to_products?: string[];  // Optional - Applicable product IDs
}

export interface TransactionOrder {
    id: string;
    mode: 'test' | 'live' | 'sandbox';
    object: string;
    // ... other order fields
}

export interface Transaction {
    id: string;
    mode: 'test' | 'live' | 'sandbox';
    object: string;
    amount: number;  // The transaction amount in cents. 1000 = $10.00
    amount_paid: number;  // The amount the customer paid in cents
    currency: string;  // Three-letter ISO currency code, uppercase
    type: 'payment' | 'invoice';  // payment(one time payments) and invoice(subscription)
    tax_country: string;  // ISO alpha-2 country code
    tax_amount: number;  // The sale tax amount in cents
    status: string;
    refunded_amount: number;  // The amount refunded in cents
    order?: TransactionOrder;
    subscription?: Subscription;
    customer?: Customer;
    description?: string;
    period_start?: number;  // Start period for the invoice as timestamp
    period_end?: number;  // End period for the invoice as timestamp
    created_at: number;  // Creation date as timestamp
}

export interface TransactionListResponse {
    items: Transaction[];
    pagination: Pagination;
}

export interface TransactionSearchParams {
    customer_id?: string;
    page_number?: number;
    page_size?: number;
}

export interface Pagination {
    total_records: number;
    total_pages: number;
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
}

export interface ProductListResponse {
    items: Product[];
    pagination: Pagination;
}

export interface ProductSearchParams {
    page_number?: number;
    page_size?: number;
}

// Update existing SearchParams to extend ProductSearchParams
export interface SearchParams extends ProductSearchParams {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface ActivateLicenseParams {
    key: string;  // The license key to activate
    instance_name: string;  // A label for the new instance to identify it in Creem
}

export interface LicenseActivation {
    id: string;
    mode: 'test' | 'live' | 'sandbox';
    object: string;
    status: 'inactive' | 'active' | 'expired' | 'disabled';
    key: string;
    activation: number;  // The number of instances that this license key was activated
    activation_limit: number | null;  // Null if activations are unlimited
    expires_at: string | null;  // Null if it does not have an expiration date
    created_at: string;
    instance: LicenseInstance[] | null;  // Associated license instances
}

export interface DeactivateLicenseParams {
    key: string;  // The license key to deactivate
    instance_id: string;  // Id of the instance to deactivate
}

export interface LicenseDeactivation {
    id: string;
    mode: 'test' | 'live' | 'sandbox';
    object: string;
    status: 'inactive' | 'active' | 'expired' | 'disabled';
    key: string;
    activation: number;  // The number of instances that this license key was activated
    activation_limit: number | null;  // Null if activations are unlimited
    expires_at: string | null;  // Null if it does not have an expiration date
    created_at: string;
    instance: LicenseInstance[] | null;  // Associated license instances
}

// Update the SDK method signature
export interface GetSubscriptionParams {
    subscription_id: string;  // Required - The unique identifier of the subscription
}

export interface CancelSubscriptionParams {
    id: string;  // Required - The subscription ID to cancel
}

// The response type matches the Subscription type since it returns the updated subscription 

export interface CreateBillingPortalSessionParams {
    customer_id: string;
}