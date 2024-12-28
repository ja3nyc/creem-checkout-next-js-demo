'use client';

import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Check } from "lucide-react";

interface PricingCardProps {
    title: string;
    price: number;
    description: string;
    features: string[];
    productId: string;
    isPopular?: boolean;
    currency?: string;
}

export function PricingCard({
    title,
    price,
    description,
    features,
    productId,
    isPopular
}: PricingCardProps) {
    function handleSubscribe() {
        const successUrl = encodeURIComponent(`${window.location.origin}/checkout/complete`);
        // The API will handle all redirects (login, checkout, etc.)
        window.location.href = `/api/subscribe/${productId}?successUrl=${successUrl}`;
    }

    return (
        <Card className={`w-[300px] ${isPopular ? 'border-primary shadow-lg' : ''}`}>
            <CardHeader>
                {isPopular && (
                    <div className="px-3 py-1 text-sm text-primary-foreground bg-primary rounded-full w-fit mb-2">
                        Most Popular
                    </div>
                )}
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold">${price}</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <ul className="space-y-2">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={handleSubscribe}
                    variant={isPopular ? "default" : "outline"}
                >
                    Get Started
                </Button>
            </CardFooter>
        </Card>
    );
} 